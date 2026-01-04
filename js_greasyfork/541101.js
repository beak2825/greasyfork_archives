// ==UserScript==
// @name            MusicBrainz: Seed URLs to Release Recordings
// @namespace       https://rinsuki.net
// @version         0.2.2
// @description     Import recording-url relationship to release's recordings.
// @author          rinsuki
// @match           https://musicbrainz.org/release/*/edit-relationships
// @match           https://*.musicbrainz.org/release/*/edit-relationships
// @grant           none
// @contributionURL https://rinsuki.fanbox.cc/
// @contributionURL https://github.com/sponsors/rinsuki
// @homepageURL     https://github.com/rinsuki/userscripts
// @supportURL      https://github.com/rinsuki/userscripts/issues
// @require         https://cdn.jsdelivr.net/npm/zod@3.24.4/lib/index.umd.js#sha256-JWI6HDMt5FcbdaKm+4vh+uQBgMj9/XtEIPCb6nJ87hw=,sha512-w/o1QQewvZigMuaxE5iaUXhSUomguLoRvf4n95QwcYXWxEs7xdMzM0Wmhqwt+PCcUkmE8prQjzcqDOIMhVD6ew==
// @downloadURL https://update.greasyfork.org/scripts/541101/MusicBrainz%3A%20Seed%20URLs%20to%20Release%20Recordings.user.js
// @updateURL https://update.greasyfork.org/scripts/541101/MusicBrainz%3A%20Seed%20URLs%20to%20Release%20Recordings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //#region node_modules/.pnpm/typedbrainz@0.1.4/node_modules/typedbrainz/lib/index.js
    // SPDX-License-Identifier: MIT
    function isReleaseRelationshipEditor(relationshipEditor) {
        return relationshipEditor.state?.entity.entityType === "release";
    }

    //#endregion

    const zSeedJSON = Zod.object({
        version: Zod.literal(1),
        recordings: Zod.record(Zod.string(), // recording id
        Zod.object({
            url: Zod.string().url(),
            types: Zod.array(Zod.string()), // link_type UUID
            ended: Zod.boolean().optional(),
        })),
        note: Zod.string(),
    }).or(Zod.object({
        version: Zod.literal(2),
        recordings: Zod.record(Zod.string(), // recording id
        Zod.array(Zod.object({
            url: Zod.string().url(),
            types: Zod.array(Zod.string()), // link_type UUID
            ended: Zod.boolean().optional(),
        }))),
        note: Zod.string(),
    }));
    const zSeedJSONFallback = Zod.object({
        version: Zod.number(),
    });

    function applyRelationships(relationships, editNote, relationshipEditor) {
        relationshipEditor.dispatch({
            type: "update-edit-note",
            editNote: (relationshipEditor.state.editNoteField.value + "\n" + editNote + "\n''Powered by \"" + GM_info.script.name + "\" script (" + GM_info.script.version + ")''").trim(),
        });
        for (const relationship of relationships) {
            // it will be marked as "incomplete" in the UI, but actually working?
            // @see https://github.com/metabrainz/musicbrainz-server/blob/e214b4d3c13f7ee6b2eb2f9c186ecab310354a5b/root/static/scripts/relationship-editor/components/RelationshipItem.js#L153-L163
            relationshipEditor.dispatch({
                type: "update-relationship-state",
                sourceEntity: relationship.recording,
                oldRelationshipState: null,
                newRelationshipState: {
                    id: relationshipEditor.getRelationshipStateId(null),
                    linkOrder: 0,
                    linkTypeID: relationship.linkTypeID,
                    _lineage: ["added"],
                    _original: null,
                    _status: 1,
                    attributes: null,
                    begin_date: null, // TODO: support?
                    end_date: null, // TODO: support?
                    editsPending: false,
                    ended: !!relationship.ended, // defaults to false
                    entity0: relationship.recording,
                    entity0_credit: "",
                    entity1: {
                        decoded: "",
                        editsPending: false,
                        entityType: "url",
                        gid: "",
                        name: relationship.url,
                        id: relationshipEditor.getRelationshipStateId(null),
                        last_updated: null,
                        href_url: "",
                        pretty_name: "",
                    },
                    entity1_credit: "",
                },
                batchSelectionCount: undefined,
                creditsToChangeForSource: "",
                creditsToChangeForTarget: "",
            });
        }
    }

    async function main() {
        // check hash
        const urlParams = new URLSearchParams(location.hash.slice(1));
        const rawJson = urlParams.get("seed-urls-v1");
        if (rawJson == null)
            return;
        while (window.MB?.relationshipEditor?.state == null) {
            console.log("Waiting for window.MB.relationshipEditor?.state to be defined...");
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log("!", window.MB.relationshipEditor);
        if (!isReleaseRelationshipEditor(window.MB.relationshipEditor)) {
            return;
        }
        const { linkedEntities, relationshipEditor } = window.MB;
        const button = document.createElement("button");
        button.textContent = "Seed URLs to Recordings";
        button.style.zoom = "2";
        button.addEventListener("click", () => {
            const anyJSON = JSON.parse(rawJson);
            const baseJSON = zSeedJSONFallback.parse(anyJSON);
            if (![1, 2].includes(baseJSON.version)) {
                alert(`Unsupported version: ${baseJSON.version}, please update the script (or contact the seeder's developer)`);
                return;
            }
            const json = zSeedJSON.parse(anyJSON);
            const errors = [];
            const preparedRelationships = [];
            for (const track of relationshipEditor.state.entity.mediums.flatMap(m => m.tracks ?? [])) {
                if (!(track.recording.gid in json.recordings))
                    continue;
                const rels = json.recordings[track.recording.gid];
                delete json.recordings[track.recording.gid];
                const alreadyAddedDomains = new Set();
                for (const rel of Array.isArray(rels) ? rels : [rels]) {
                    const relUrl = new URL(rel.url);
                    if (alreadyAddedDomains.has(relUrl.hostname)) {
                        errors.push(`You can't add multiple same domain URLs for a recording at once! URL: ${rel.url} Recording: ${track.recording.gid}`);
                        continue;
                    }
                    alreadyAddedDomains.add(relUrl.hostname);
                    for (const relType of rel.types) {
                        let linkTypeID;
                        if (relType in linkedEntities.link_type && linkedEntities.link_type[relType].type0 === "recording" && linkedEntities.link_type[relType].type1 === "url") {
                            linkTypeID = linkedEntities.link_type[relType].id;
                        }
                        if (linkTypeID == null) {
                            for (const lt of Object.values(linkedEntities.link_type)) {
                                if (lt.type0 !== "recording")
                                    continue;
                                if (lt.type1 !== "url")
                                    continue;
                                console.log(lt);
                                if (lt.name === relType) {
                                    linkTypeID = lt.id;
                                    break;
                                }
                            }
                        }
                        if (linkTypeID == null) {
                            errors.push(`Failed to find link type ${JSON.stringify(relType)} for recording ${track.recording.gid}`);
                            continue;
                        }
                        preparedRelationships.push({
                            recording: track.recording,
                            url: rel.url,
                            linkTypeID,
                            ended: rel.ended ?? false,
                        });
                    }
                }
            }
            for (const remainingRecordingId of Object.keys(json.recordings)) {
                errors.push(`Failed to find recording: ${remainingRecordingId}, you might be need to expand mediums before press seed button.`);
            }
            if (errors.length === 0) {
                applyRelationships(preparedRelationships, json.note, relationshipEditor);
                button.textContent = "URLs seeded successfully!";
                button.disabled = true;
            }
            else {
                alert("Failed to seed urls:\n" + errors.map(x => "* " + x).join("\n"));
            }
        });
        const before = document.querySelector("#content > p");
        before.parentElement.insertBefore(button, before);
        button.focus();
        console.log("done");
    }
    main();

})();
