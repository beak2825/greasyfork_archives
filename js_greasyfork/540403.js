// ==UserScript==
// @name         Rule PM Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Helpful functions to notify violators.
// @author       Mangoboy
// @match        https://gazellegames.net/inbox.php?action=compose*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540403/Rule%20PM%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/540403/Rule%20PM%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`
    input, select, button {
    margin: 3px;
    }
` );

    const defendant = document.querySelector('#username input').value;
    const prosecutor = document.querySelector('#nav_userinfo .username').innerText;

    const subject = document.getElementsByName('subject')[0];

    const winDropdown = document.createElement('select');
    const ostDropdown = document.createElement('select');

    const rulesText = {
        "game": "[rule]1.1.1[/rule]. Only games, game documents (walkthroughs, guides, patches, cracks, artwork), OSTs, e-Books, magazines, and utilities/applications may be uploaded. All uploaded media must be directly and primarily related to games. For edge cases, see [url=https://gazellegames.net/wiki.php?action=article&id=583]Examples of Game-Related Media[/url] or contact staff for guidance if uncertainties remain.",
        "dupe": "[rule]1.1.2[/rule]. Duplicate torrents in any category are not allowed. With some exceptions.",
        "adverts": "[rule]1.1.7[/rule]. No advertisements. Do not advertise yourself, other sites or other users in your torrent descriptions, torrent directories, or in the contents of your torrent. When uploading content sourced from elsewhere, be sure to remove any spam text files or other forms of advertising. Exceptions: [url=https://gazellegames.net/wiki.php?action=article&id=254]Recognised P2P groups[/url] may add URLs to their own sites in the files of their official releases.",
        "free": "[rule]1.2.2[/rule]. Freely available content may not be uploaded as a torrent under any platform or category. If the content is officially mirrored, a group should be made and external link added. Do not use adfly or similar URL shorteners. If the content is not mirrored officially, it may be archived to GGn as a torrent within the group. If you are unsure, ask a staff member for clarification.",
        "custom": "[rule]1.1.9[/rule]. Self-extracting 7-Zip, WinZip, WinRAR or any other self-extracting archive formats as well as custom installers like InstallShield are not allowed for Home Rips. They pose a security risk to our members. Always upload the ISO itself instead of its contents. In case the ISO is not available, its contents should be uploaded by compressing them in a standard archive format. An exception to this rule are [url=https://gazellegames.net/wiki.php?action=article&id=448]Approved Custom Installers.[/url]",
        "sysreqs": "[rule]1.1.13[/rule]. Non-console based (Windows, Linux, Mac, Android, iPhone, etc.) software (games, utilities/applications) MUST include the requirement specification. When uploading you MUST put the minimum and, if possible, recommended system requirements in the game description within its own quote box. Software that is continually being released should quote the new system requirements in the RELEASE DESCRIPTION if the game description system requirements are not applicable to the release. Games released prior to 2000 do not need the system requirements. For software without system requirements, \"No system requirements available\" should be added in the game description.",
        "scene": "[rule]1.3.4[/rule]. Scene releases must be complete (as released) to use the scene label — only an unarchived file_id.diz may be omitted. If there are any other changes to the tags, files, tracks or naming, then it is no longer a scene release in which case it should be uploaded as \"Other\" and labeled as a Home Rip. Original scene title and NFO must be still used.",
        "tags": "[rule]2.1.1[/rule]. All games must be tagged with at least two genres.",
        "screens": "[rule]2.1.2[/rule]. All game descriptions must contain at least 4 screenshots. Screenshots must be an overall representation of gameplay and should use the same resolution. Uploaded images must use one of the [url=https://gazellegames.net/wiki.php?action=article&id=214]whitelisted image hosts[/url]. Images should not be watermarked by third parties.",
        "split": "[rule]2.1.6[/rule]. Non-scene and non-p2p game contents or disc images should be compressed into a single standard archive format. Do not use split archives. Archives of game contents or images that cannot be compressed to at least 90% of their original size should not be compressed. Additionally, PC games requiring the disc image to play the game should not be compressed. All .app Mac apps must be archived in order to function properly.",
        "version": "[rule]2.1.9[/rule]. The Release Title of non-console based games should at least include the game name and version information. For example, Game Name v0.0.0 or Game Name vYYYY-MM-DD.",
        "langs": "[rule]2.1.10[/rule]. Multi-language torrents must list the languages within the Release Description field. This includes torrents with generated NFOs. Undubs should be tagged as multi-language.",
        "changelog": "[rule]2.1.11[/rule]. Changelog for game updates should be spoiler or hide tagged and included in the release description. If a Scene NFO includes the changelogs, this convention does not need to be used. If no changelog is available, \"No changelog available\" should be added instead.",
        "drmfree": "[rule]2.2.1[/rule]. Unaltered archives or installers from DRM-Free stores or the developer’s website should be labelled as DRM-Free. Any other uploads (e.g. repacks, Steam rips, other Home Rips) may not be labelled as DRM-Free, even if the files do not contain any DRM.",
        "p2p": "[rule]2.5.8[/rule]. Only two P2P repacks are allowed to co-exist with other releases: a lossless and a lossy version. Check the [url=https://gazellegames.net/wiki.php?action=article&id=254]List of Recognized P2P Groups[/url] before uploading. They should be uploaded \"as is\" and without changing the file structure in any way. Staff reserves the right to allow a P2P release at their own discretion in case two or more similar P2P releases compete for a position.",
        "tagsdesc": "[rule]4.3.1[/rule].  All tags associated with the album are required. A complete description including the tracklist and album details is also required.",
        "proper": "[rule]4.3.3[/rule]. All tracklistings, directories and filenames must use English titles where available instead of foreign language. Use proper capitalization.",
        "filenames": "[rule]4.3.5[/rule]. Track filenames must contain a track number and a title following the [url=https://gazellegames.net/wiki.php?action=article&id=31]Capitalization Guidelines[/url], e.g. 01 - Track Name, 02 - Track Name, etc., and must be sortable by track number or playing order. A \"Various Artists\" rip should also include the artist's name, e.g. 01 - Artist - Track Name, 02 - Artist - Track Name, etc. This excludes scene releases which should keep their original track naming, and single-track releases which should follow the format \"Artist - Track Name\".",
        "tagged": "[rule]4.3.8[/rule]. Music files must be properly tagged. The required meta tags (e.g. ID3, Vorbis) are: Artist, Album, Title, Track Number. Embedded images and tags may not exceed 1 MB in padding for each track. This excludes single-track releases which do not require a Track Number tag.",
    }

    const winRules = [
        { value: '', text: '-- Select Game Rule --' },
        { value: 'game', text: '1.1.1 Not game-related' },
        { value: 'dupe', text: '1.1.2 Dupes' },
        { value: 'adverts', text: '1.1.7 Advertisements' },
        { value: 'custom', text: '1.1.9 Custom installer' },
        { value: 'sysreqs', text: '1.1.13 Missing sysreqs' },
        { value: 'free', text: '1.2.2 Freely available' },
        { value: 'scene', text: '1.3.4 Altered scene' },
        { value: 'tags', text: '2.1.1 Missing tags' },
        { value: 'screens', text: '2.1.2 Screenshots' },
        { value: 'split', text: '2.1.6 Split Archive' },
        { value: 'version', text: '2.1.9 Missing version' },
        { value: 'langs', text: '2.1.10 Missing langs' },
        { value: 'changelog', text: '2.1.11 Missing changelog' },
        { value: 'drmfree', text: '2.2.1 DRM Free' },
        { value: 'p2p', text: '2.5.8 Allowed P2P' },
    ]

    const ostRules = [
        { value: '', text: '-- Select OST Rule --' },
        { value: 'tagsdesc', text: '4.3.1 All Tags/Desc' },
        { value: 'proper', text: '4.3.3 Proper English' },
        { value: 'filenames', text: '4.3.5 Filenames' },
        { value: 'tagged', text: '4.3.8 Files tagged' },
    ]

    const uploadViolation = document.createElement('button');
    uploadViolation.type = 'button';
    uploadViolation.textContent = 'First Upload Violation';
    uploadViolation.style.position = 'relative';

    uploadViolation.addEventListener('click', () => {
        subject.value = "Uploading Tips";
        const textarea = document.querySelector('#body');
        if (textarea) {
            textarea.value =
                `Hey ${defendant},

Congratulations on your first upload(s)! I greatly appreciate anyone willing to contribute to GGn.

Allow me to give you some pointers in uploading. At the moment your upload(s) are violating a couple of upload rules:
(LIST GROUPS VIOLATING RULES HERE)

The rule(s) violated are:

I have fixed this for you at the moment. Take this group as an example for any future uploads. You can always refer to my and/or any of my fellow staffers uploads. You can easily avoid this by using userscripts. First of all if you haven't already, install a browser plugin like [url=https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo]Tampermonkey[/url] to be able to run these userscripts. When you have installed this I recommend installing these:
[*][url=https://greasyfork.org/scripts/1024-whutbbcode/code/WhutBBCode.user.js]WhutBBCode?[/url]
[*][url=https://gist.github.com/ZeDoCaixao/85e7c3d0bd05c2b3c06e82c716fdf4d3]GGn Site Links[/url]
And be sure to check out [url=https://gazellegames.net/forums.php?action=viewthread&threadid=21302]ZeDoCaixao's Useful Scripts[/url] for scripts such as Steam Uploady!

Make sure to go through the [url=https://gazellegames.net/wiki.php?action=article&id=245]Uploading Guide[/url], there are plenty of tips on there on how to easily upload on GGn! What is also really important is proper Capitalization on Group Titles, you can read all about it in the [url=https://gazellegames.net/wiki.php?action=article&id=31]Capitalization Guidelines[/url]!

Feel free to PM me or any of our friendly staff if you have any questions regarding our rules. You may also find our community forums to be very helpful and informative.

${prosecutor}`;
        } else {
            alert('No textarea found on the page.');
        }
    });

    const ruleViolation = document.createElement('button');
    ruleViolation.type = 'button';
    ruleViolation.textContent = 'Rule Violation';
    ruleViolation.style.position = 'relative';

    ruleViolation.addEventListener('click', () => {
        subject.value = "Upload Violating Site Rules";
        const textarea = document.querySelector('#body');
        if (textarea) {
            textarea.value =
                `Hello ${defendant},

One or more of your uploaded torrents was violating one or more of the site rules. The rule violating upload(s) are:
(List torrent(s) and/or groups(s) here)

The rule(s) violated are:

(IFIXORUFIX)

In the future, please be aware of this and other rules related to uploading by first checking here: https://gazellegames.net/rules.php?p=upload. Additionally, feel free to PM me or any of our friendly staff if you have any questions regarding our rules. You may also find our community forums to be very helpful and informative.

We hope to see more uploads from you in the future!

${prosecutor}`;
        } else {
            alert('No textarea found on the page.');
        }
    });

    const iFixButton = document.createElement('button');
    iFixButton.type = 'button';
    iFixButton.textContent = 'i fix';
    iFixButton.style.position = 'relative';

    iFixButton.addEventListener('click', () => {
        const textarea = document.querySelector('#body');
        if (textarea) {
            textarea.value = textarea.value.replace('(IFIXORUFIX)', 'I\'ve fixed these for you this time, but in the future, please be aware of this and other rules related to uploading by first checking here: https://gazellegames.net/rules.php?p=upload. Additionally, feel free to PM me or any of our friendly staff if you have any questions regarding our rules. You may also find our community forums to be very helpful and informative.');
        } else {
            alert('No textarea found on the page.');
        }
    });

    const uFixButton = document.createElement('button');
    uFixButton.type = 'button';
    uFixButton.textContent = 'u fix';
    uFixButton.style.position = 'relative';

    uFixButton.addEventListener('click', () => {
        const textarea = document.querySelector('#body');
        if (textarea) {
            textarea.value = textarea.value.replace('(IFIXORUFIX)', 'You fix this shit, idk.');
        } else {
            alert('No textarea found on the page.');
        }
    });

    for (const opt of winRules) {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        winDropdown.appendChild(option);
    }

    winDropdown.addEventListener('change', () => {
        const selected = winDropdown.value;
        const textarea = document.querySelector('#body');
        if (textarea) {
            textarea.value = textarea.value.replace('The rule(s) violated are:', 'The rule(s) violated are:\n[*]' + rulesText[selected]);
        } else {
            alert('No textarea found on the page.');
        }
    });

    for (const opt of ostRules) {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        ostDropdown.appendChild(option);
    }

    ostDropdown.addEventListener('change', () => {
        const selected = ostDropdown.value;
        const textarea = document.querySelector('#body');
        if (textarea) {
            textarea.value = textarea.value.replace('The rule(s) violated are:', 'The rule(s) violated are:\n[*]' + rulesText[selected]);
        } else {
            alert('No textarea found on the page.');
        }
    });

    const row = document.querySelector('.comp tbody').insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const rule1 = document.createElement('div');
    const rule2 = document.createElement('div');

    rule1.appendChild(uploadViolation);

    rule2.appendChild(ruleViolation);
    rule2.appendChild(iFixButton);
    rule2.appendChild(uFixButton);
    rule2.appendChild(winDropdown);
    rule2.appendChild(ostDropdown);


    cell1.innerHTML = "PM Helper";
    cell2.appendChild(rule1);
    cell2.appendChild(document.createElement('hr'));
    cell2.appendChild(rule2);
})();