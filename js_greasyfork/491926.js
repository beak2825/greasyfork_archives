// ==UserScript==
// @name         GGn EGS Uploady
// @namespace    https://gazellegames.net/
// @version      8
// @license MIT
// @description  Fill upload form with Epic Games Store info. Edited from "GGn New Uploady"
// @author       NeutronNoir, ZeDoCaixao, ingts, sly_db_cooper
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @grant        GM_xmlhttpRequest
// @connect      store.epicgames.com
// @connect      store-content.ak.epicgames.com
// @downloadURL https://update.greasyfork.org/scripts/491926/GGn%20EGS%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/491926/GGn%20EGS%20Uploady.meta.js
// ==/UserScript==

const allowedTags = new Set([
    "action", "adventure", "strategy", "simulation", "shooter", "dungeon.crawler", "survival", "first.person", "casual",
    "open.world", "horror", "puzzle", "metroidvania", "racing", "exploration", "turn.based", "comedy", "sports", "stealth",
    "fighting", "party", "trivia", "fantasy", "card.game", "turn.based.strategy", "music", "retro", "educational",
    "third.person.shooter", "4x", "space", "survival.horror", "tower.defense", "driving", "arcade", "rhythm", "demo",
    "management", "programming", "visual.novel", "war", "base.building", "building", "cyberpunk"
])

const tagMapping = new Map([
    ["action.adventure", ["action", "adventure"]],
    ["action.rpg", ["action", "role.playing.game"]],
    ["ccg", ["card.game"]],
    ["city.builder", ["city.building"]],
    ["fps", ["first.person.shooter"]],
    ["lovecraftian", ['horror']],
    ["mmo", ["massively.multiplayer"]],
    ["puzzle.platformer", ['puzzle', 'platformer']],
    ['real.time.tactics', ['real.time.strategy']],
    ['rogue.like', ['roguelike']],
    ['rogue.lite', ['roguelike']],
    ['rpg', ['role.playing.game']],
    ['rts', ['real.time.strategy']],
    ['sci.fi', ['science.fiction']],
    ['space.sim', ['space', 'simulation']],
    ['strategy.rpg', ['strategy', 'role.playing.game']],
    ['tactical.rpg', ['tactics', 'role.playing.game']],
    ['tactical', ['tactics']],
])

function processTags(tags) {
    return [
        ...new Set(
            tags.map(tag => tag.toLowerCase().replace(/[ -]/g, "."))
                .filter(tag => allowedTags.has(tag) || tagMapping.has(tag))
                .flatMap(tag => allowedTags.has(tag) ? [tag] : tagMapping.get(tag))
        )
    ].join(', ')
}

function markdown2bb(md) {
    if (!md) return ""
    // fix html which is actually markdown
    md = html2bb(md);

    // remove comments
    md = md.replace(/<!--.*-->/g, "");
    //bold text
    md = md.replace(/[*_]{2}(.*)[*_]{2}/g, "[b]$1[/b]");
    // italic text
    md = md.replace(/[*_](.*)[*_]/g, "[b]$1[/b]");
    // titles
    md = md.replace(/\n#+ (.*)\n/g, "\n[align=center][u][b]$1[/b][/u][/align]\n")
    // bullets
    md = md.replace(/\n(\[.\])?[*--+•]/g, "\n[*]$1")
    // quotes (WILL BREAK WITH NESTED QUOTES)
    md = md.replace(/\n>(.*\n)>?/g, "\n> $1 <")
        .replace(/<\n>/g, "")
        .replace(/> (.*)/g, "[quote]$1")
        .replace(/.*</g, "[/quote]");

    // remove images
    md = md.replace(/\n!\[.*\]\(.*\)\n/g, "")
    // fix newlines
    md = md.replace(/\n\n\n+/g, "\n\n");
    // remove copyright shit
    md = md.replace(/Ⓒ.*\n/g, "")

    return md.trimEnd()
}

function html2bb(str) {
    if (!str) return ""
    str = str.replace(/< *br *\/*>/g, "\n\n") //*/
    str = str.replace(/< *b *>/g, "[b]")
    str = str.replace(/< *\/ *b *>/g, "[/b]")
    str = str.replace(/< *u *>/g, "[u]")
    str = str.replace(/< *\/ *u *>/g, "[/u]")
    str = str.replace(/< *i *>/g, "[i]")
    str = str.replace(/< *\/ *i *>/g, "[/i]")
    str = str.replace(/< *strong *>/g, "[b]")
    str = str.replace(/< *\/ *strong *>/g, "[/b]")
    str = str.replace(/< *em *>/g, "[i]")
    str = str.replace(/< *\/ *em *>/g, "[/i]")
    str = str.replace(/< *li *>/g, "[*]")
    str = str.replace(/< *\/ *li *>/g, "")
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "")
    str = str.replace(/< *\/ *ul *>/g, "")
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[align=center][u][b]")
    str = str.replace(/< *h[12] *>/g, "\n[align=center][u][b]")
    str = str.replace(/< *\/ *h[12] *>/g, "[/b][/u][/align]\n")
    str = str.replace(/\&quot;/g, "\"")
    str = str.replace(/\&amp;/g, "&")
    str = str.replace(/< *img *src="([^"]*)".*>/g, "\n")
    str = str.replace(/< *a [^>]*>/g, "")
    str = str.replace(/< *\/ *a *>/g, "")
    str = str.replace(/< *p *>/g, "\n\n")
    str = str.replace(/< *\/ *p *>/g, "")
    str = str.replace(//g, "\"")
    str = str.replace(//g, "\"")
    str = str.replace(/  +/g, " ")
    str = str.replace(/\n +/g, "\n")
    str = str.replace(/\n\n\n+/gm, "\n\n")
    str = str.replace(/\n\n\n+/gm, "\n\n")
    str = str.replace(/\[\/b]\[\/u]\[\/align]\n\n/g, "[/b][/u][/align]\n")
    str = str.replace(/\n\n\[\*]/g, "\n[*]")
    return str
}

function fix_emptylines(str) {
    const lst = str.split("\n")
    let result = ""
    let empty = 1
    lst.forEach(function (s) {
        if (s) {
            empty = 0
            result = result + s + "\n"
        } else if (empty < 1) {
            empty = empty + 1
            result = result + "\n"
        }
    })
    return result
}

function pretty_sr(str) {
    if (!str) return ""
    str = str.replace(/™/g, "")
    str = str.replace(/®/g, "")
    str = str.replace(/:\[\/b\] /g, "[/b]: ")
    str = str.replace(/:\n/g, "\n")
    str = str.replace(/:\[\/b\]\n/g, "[/b]\n")
    str = str.replace(/\n\n\[b\]/g, "\n[b]")
    return str
}

function fillOptions(options = {
    method: "GET",
    responseType: "json",
    onSuccess: (response) => {
        return JSON.parse(response.responseText)
    }
}) {
    options.method = options.method || "GET";
    options.responseType = options.responseType || "json";
    if (!options.onSuccess) {
        options.onSuccess = (response) => { return JSON.parse(response.responseText) }
    }
    return options;
}

function doFetch(url, options = {
    method: "GET",
    responseType: "json",
    onSuccess: (response) => {
        return JSON.parse(response.responseText)
    }
}) {
    const fullOptions = fillOptions(options)

    let resolve, reject;
    let responsePromise = new Promise((promiseResolve, promiseReject) => {
        resolve = promiseResolve;
        reject = promiseReject;
    });


    GM_xmlhttpRequest({
        url: url,
        method: fullOptions.method,
        responseType: fullOptions.responseType,
        body: fullOptions.body,
        onload: (response) => {
            if (response.status < 200 || response.status >= 400) {
                console.error(response.responseText, url);
                reject(response)
            } else {
                resolve(fullOptions.onSuccess(response));
            }
        }
    })
    return responsePromise;
}

function graphql(query, variables, extensions) {
    const jsonVariables = JSON.stringify(variables)
    const jsonExtensions = JSON.stringify(extensions)
    const url = `https://store.epicgames.com/graphql?operationName=${query}&variables=${jsonVariables}&extensions=${jsonExtensions}`
    return doFetch(url).then(response => { return response.data });
}

function getProductMapping(slug) {
    return doFetch(`https://store-content.ak.epicgames.com/api/en-US/content/products/${slug}`)
}

function getGameMapping(slug) {
    const variables = {
        pageSlug: slug,
        locale: "en-US",
    }
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash: "781fd69ec8116125fa8dc245c0838198cdf5283e31647d08dfa27f45ee8b1f30",
        }
    }

    return graphql("getMappingByPageSlug", variables, extensions)
}

function getCatalogOffer(identifiers) {
    const variables = {
        country: "US",
        locale: "en-US",
        sandboxId: identifiers.sandboxId,
        offerId: identifiers.offerId,
    }
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash: "c4ad546ad2757b60ff13ace19ffaf134abb23cb663244de34771a0444abfdf33",
        }
    }
    return graphql("getCatalogOffer", variables, extensions).then(data => {
        return data.Catalog.catalogOffer;
    });
}

function getProductHomeConfig(identifiers) {
    const variables = {
        locale: "en-US",
        sandboxId: identifiers.sandboxId,
    }
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash: "5a922bd3e5c84b60a4f443a019ef640b05cb0ae379beb4aca4515bf9812dfcb4",
        }
    }
    return graphql("getProductHomeConfig", variables, extensions).then(data => {
        const page = data.Product.sandbox.configuration.filter(configs => Object.keys(configs).length > 0);
        if (page.length > 0) {
            return page.shift().configs
        }
        return {}
    });
}

function getStoreConfig(identifiers) {
    const variables = {
        locale: "en-US",
        sandboxId: identifiers.sandboxId,
    }
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash: "0247771a057e44ee16627574296ad79fd48e41b4cb056465515a54ade05aa7f2",
        }
    }
    return graphql("getStoreConfig", variables, extensions).then(data => {
        return data.Product.sandbox.configuration.filter(configs => Object.keys(configs).length > 0).shift().configs;
    });
}

function getAgeRating(identifiers) {
    // get ratings for france so that they are PEGI
    const url = `https://egs-platform-service.store.epicgames.com/api/v1/egs/products/${identifiers.productId}/offers/${identifiers.offerId}/age-rating?country=FR&locale=en-UK&store=EGS`;
    return doFetch(url).then(data => {
        return data.ageRating;
    })
}

function chainCalls(identifiers, calls = {}) {
    const total = Object.keys(calls).length;

    let gameData = {};
    let finished = 0;
    let resolve;
    let responsePromise = new Promise((promiseResolve, _) => {
        resolve = promiseResolve;
    });

    for (let key of Object.keys(calls)) {
        calls[key](identifiers).then(response => {
            gameData[key] = response;
            if (++finished === total) {
                resolve(gameData);
            }
        }).catch(err => { console.error(key, err) })
    }
    return responsePromise;
}

const location = new URL(window.location.href);
const queryParams = new URLSearchParams(location.search);

let parser = new DOMParser();
const epicRowTemplate = `
    <table>
        <tr id="egs">
            <td class="label">Epic Store Link:</td>
            <td>
                <input id="egslink" size="40" type="text"/>
                <a href="javascript:;" onclick="document.getElementById('platform').value = 'Windows'">Win</a>
                <a href="javascript:;" onclick="document.getElementById('platform').value = 'Linux'">Lin</a>
                <a href="javascript:;" onclick="document.getElementById('platform').value = 'Mac'">Mac</a>
                - For use with the EGS Uploady
            </td>
        </tr>
    </table>`
let row = parser.parseFromString(epicRowTemplate, "text/html");
let gameTitle = document.getElementById('title_tr');
gameTitle.parentNode.insertBefore(row.getElementById('egs'), gameTitle);
let egsLinkInput = document.getElementById('egslink');


if (queryParams.get('action') === 'editgroup') {
    // make it so we can do this for non-uploads too.
}

egsLinkInput.onblur = () => {
    if (!egsLinkInput.value.startsWith("https://store.epicgames.com")) {
        // ignore bad links
        return
    }

    const egsUrl = new URL(egsLinkInput.value);
    const paths = egsUrl.pathname.split("/");
    const slug = paths[paths.length - 1];
    getGameMapping(slug).then(response => {
        const sandboxId = response.StorePageMapping.mapping.sandboxId;
        const offerId = response.StorePageMapping.mapping.mappings.offerId;
        const productId = response.StorePageMapping.mapping.productId;
        return { sandboxId, offerId, productId }
    }).then(identifiers => {
        if (!identifiers.offerId) {
            return getProductMapping(slug).then(productMapping => {
                identifiers.offerId = productMapping.pages[0].offer.id
                return identifiers;
            })
        }
        return identifiers;
    }).then(identifiers => {
        return chainCalls(
            identifiers,
            {
                catalog: getCatalogOffer,
                product: getProductHomeConfig,
                store: getStoreConfig,
                ageRating: getAgeRating,
            },
        )
    }).then(fillForm);
}

const ratingMap = {
    3: 1,
    7: 3,
    12: 5,
    16: 7,
    18: 9,
    0: 13, // assume
}

function formatTechnicalSpecs(technicalSpecs) {
    if (!technicalSpecs || Object.keys(technicalSpecs).length === 0) {
        return "[i]Not able to automatically obtain[/i]"
    }
    let specs;
    switch (document.getElementById('platform').value) {
        case "Mac":
            specs = technicalSpecs.macos;
            break;
        case "Linux":
            specs = technicalSpecs.linux;
            break;
        case "Windows":
        default:
            specs = technicalSpecs.windows;
    }

    return specs.map(line => {
        return `[align=center][b]${line.title}[/b][/align]${line.recommended ? "\n[i]Recommended[/i]: " + line.recommended : ""}${line.minimum ? "\n[i]Minimum[/i]: " + line.minimum : ""}\n`;
    }).join("");

}

function formatDescription(description, shortDescription, technicalSpecs) {
    return markdown2bb(`[align=center][b][u]About the game[/u][/b][/align]

    ${description ? description : shortDescription}

    [align=center][b][u]Technical Specifications[/u][/b][/align]
    ${formatTechnicalSpecs(technicalSpecs)}`
    )
}

function fillForm(gameInfo) {
    document.getElementById('title').value = gameInfo.catalog.title;
    document.querySelector('input[name="year"]').value = new Date(gameInfo.catalog.pcReleaseDate).getUTCFullYear();
    document.querySelector('textarea#album_desc').value = formatDescription(
        gameInfo.product.longDescription,
        gameInfo.catalog.description,
        gameInfo.store.technicalRequirements,
    );
    if (gameInfo.store.socialLinks) {
        const homepage = gameInfo.store.socialLinks.filter(social => social.platform === "homepage")
        document.querySelector('input[name="gameswebsiteuri"]').value = homepage.length > 0 ? homepage.shift().url : "";
    }
    if (gameInfo.ageRating.ageControl) {
        document.querySelector('select[name="rating"]').value = ratingMap[gameInfo.ageRating.ageControl];
    }

    if (gameInfo.product.keyImages) {
        const screenshots = gameInfo.product.keyImages.filter(media => media.type === "featuredMedia");

        document.querySelectorAll('input[name^="screen"]').forEach((el, i) => {
            if (screenshots.length > i) {
                el.value = screenshots[i].url;
                el.parentNode.querySelector('input[value="PTPImg It"]');
            }
        })
    }

    if (gameInfo.catalog.keyImages) {
        const coverImage = gameInfo.catalog.keyImages.filter(media => media.type === "OfferImageTall").shift()
        document.querySelector('input[name="image"]').value = coverImage.url;
    }

    if (gameInfo.catalog.tags) {
        document.querySelector('input[name="tags"]').value = processTags(gameInfo.catalog.tags.map(tag => tag.name))
    }
}
