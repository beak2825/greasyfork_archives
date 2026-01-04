// ==UserScript==
// @name         Mangago Backup Lists
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Backup your reading lists
// @author       You
// @match        https://www.mangago.me/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.isotope/3.0.6/isotope.pkgd.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432300/Mangago%20Backup%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/432300/Mangago%20Backup%20Lists.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // plugins used:
    // Isotope - for sortable list view: https://isotope.metafizzy.co/
    // lz-string - for string compression: https://pieroxy.net/blog/pages/lz-string/index.html
    console.log('mggBackup v.1.2.4');

    // Current limit for sortable view. Any more than this results in degraded browser performance.
    // Sadly, this is probably the limit of what I can do with this userscript on mgg's site + given its current structure and capability.
    // I'm working on getting a separate website up and running so that we can have a more.
    // For actual backups (.csv(excel)/.json) though, I've tested it working okay for up to 10,000 stories. Beyond that, I'm afraid I can't guarantee success :'<
    const idealLimit = 1000

    // function that detects how many current pages a specific list has
    function setTotalPages() {
        const $paginagtion = $('.pagination').first();
        let totalPages = undefined

        if ($paginagtion[0]) {
            totalPages = $paginagtion.attr('total');
        } else {
            totalPages = 1;
        }

        localStorage.setItem('totalPages', totalPages);
    }

    function detectList() {
        // detects list by current URL
        if (getUrlWithoutParams().match(/(manga\/1\/)/gm)) {
            return 1 // manga/1/ = Want To Read
        } else if ((getUrlWithoutParams().match(/(manga\/2\/)/gm))) {
            return 2 //manga/2/ = Currently Reading
        } else if (getUrlWithoutParams().match(/(manga\/3\/)/gm)) {
            return 3 //manga/3/ = Already Read
        }

        return 0
    }

    // function that gathers details about the stories to save
    function saveList(custom = false) {
        console.log('saving...');

        if (!custom) {
            const arr = [];
            const $toSave = $('#collection-nav').next().find('.manga');

            $toSave.each(function() {
                const $this = $(this);

                // gets details for each story
                const $titleLink = $this.find('.title').find('a');
                const title = $titleLink.text();

                const author = $this.find('.title').next().find('div').text().split("|")[1].trim();

                const link = $titleLink.attr('href');
                const cover = $this.find('.cover').find('img').data('src');
                let timestamp = '';
                let tags = [];

                $this.find('.status-rate').find('div').each(function() {
                    if ($(this).text().match(/(marked)/gm)) {
                        timestamp = $(this).text().replace(/(marked)/gm, '').trim();
                    }

                    if ($(this).text().match(/(Tags)/gm)) {
                        $(this).find('.tag')?.each(function() {
                            tags.push($(this).text().trim());
                        });
                    }
                })

                const $note = $this.find('.short-note');

                const note = {
                    text: $note.text().trim(),
                    html: $note.text().trim() ? $note[0].outerHTML : ``
                }

                let rating = undefined

                const $stars = $this.find('.status-rate').find('.stars9').first().find('.stars9');

                let ratingWidth = 0;

                if ($stars.css('width')) {
                    ratingWidth = parseInt($stars.css('width').replace(/(px)/gm, ''));
                }

                // star ratings are weird because they are not explicitly exposed as 1,2,3,4,5
                // so I'm only getting the width of the yellow fill of the stars and assigning each into 1-5 LMAO
                switch (ratingWidth) {
                    case (11):
                        rating = 1;
                        break;
                    case (22):
                        rating = 2;
                        break;
                    case (33):
                        rating = 3;
                        break;
                    case (44):
                        rating = 4;
                        break;
                    case (55):
                        rating = 5;
                        break;
                    default:
                        rating = undefined;
                        break;
                }

                arr.push({
                    title,
                    author,
                    link,
                    cover,
                    timestamp,
                    note,
                    rating,
                    tags
                });
            })

            // I turned these into single letter keys for space saving.
            const listId = detectList() === 1
                ? 'w' // want to read
                : detectList() === 2
                    ? 'c' // currently reading
                    : detectList() === 3
                        ? 'd' // done reading
                        : undefined;

            if (listId) {
                // this part is the reason why if you check your localStorage on dev tools, there are weird signs
                // I am using lz-string to compress strings to be able to save more stories
                const compressed = compressString(JSON.stringify(arr))

                const { page } = getUrlParams()

                localStorage.setItem(`${listId + page}`, compressed);
            }
        } else {
            const params = getUrlParams();

            const { page } = params;

            const listDetails = {
                title: {
                    text: '',
                    html: ''
                },
                listId: '',
                curator: {
                    username: '',
                    id: '',
                },
                created: '',
                updated: '',
                description: {
                    text: '',
                    html: ''
                },
                tags: []
            }

            if (page) {
                if (parseInt(page, 10) === 1) {
                    const $h1 = $('.w-title').find('h1');
                    const titleText =  $h1.text().trim();
                    listDetails.title.text = titleText;
                    listDetails.title.html =  titleText ? $h1[0].outerHTML : '';
                    listDetails.listId = getListId();

                    const $userProfile = $('.user-profile')
                    const $info = $userProfile.find('.info');
                    const curatorLinkParts = $userProfile.find('.pic').find('a').attr('href').split('/').filter(url => url !== '');
                    const curatorId = curatorLinkParts[curatorLinkParts.length - 1];
                    listDetails.curator.username = $info.find('h2').text();
                    listDetails.curator.id = curatorId;

                    const dates = $info.contents().filter(function(){
                        return this.nodeType == 3;
                    })[1].nodeValue.trim().split(': ');

                    listDetails.updated = dates[2];
                    listDetails.created = dates[1].split('Last')[0].trim();

                    const $description = $('.article').find('.description')

                    const descText = $description.text().trim()

                    listDetails.description.text = descText;
                    listDetails.description.html = descText ? $description[0].outerHTML : '';

                    const tagsArr = []
                    const $tags = $('.content').find('.tag');

                    $tags.each((i, el) => {
                        const $el = $(el);
                        tagsArr.push($el.text());
                    })

                    listDetails.tags = tagsArr;

                    const listId = getListId();
                    const type = getTypeIndexFromCustomList(listId).type;

                    localStorage.setItem(`${type}${listId}-d`, compressString(JSON.stringify(listDetails)));
                }
            }

            const arr = [];
            const $toSave = $('.manga.note-and-order');

            const $h1 = $('.w-title').find('h1');
            const titleText =  $h1.text().trim();
            const listTitleDetails = {
                text: titleText,
                html: titleText ? $h1[0].outerHTML : ''
            }

            $toSave.each(function(i, el) {
                const $this = $(el);

                // gets details for each story
                const $titleLink = $this.find('.title').find('a');
                const title = $titleLink.text();

                const author = $this.find('.info').filter((i, el) => {
                    const $el = $(el);

                    return $el.text().match(/(Author\(s\))/gm);
                }).find('span').text();


                const link = $titleLink.attr('href');
                const cover = $this.find('.cover').find('img').data('src') || $('.album-photos').find('img').first().attr('src') || 'none';

                const index = $this.attr('_index');

                const tags = $this.find('.info').filter((i, el) => {
                    const $el = $(el);

                    return $el.text().match(/(Genre\(s\))/gm);
                }).find('span').text().split('/').map(item => item.trim()).filter(item => item !== "");


                const $note = $this.find('.info.summary');

                const note = {
                    text: $note.text().trim(),
                    html: $note.text().trim() ? $note[0].outerHTML : ``
                }

                const rating = $this.find('.title').next().find('.info').filter((i, el) => {
                    const $el = $(el);

                    let returnFlag = false;
                    if ($el.find('#stars0')[0]) {
                        returnFlag = true;
                    }

                    return returnFlag;
                }).find('span').text().trim();

                const timestamp = $this.find('.info.summary').next().find('.left').text();

                arr.push({
                    title,
                    author,
                    link,
                    cover,
                    timestamp,
                    note,
                    rating,
                    tags,
                    index,
                    listId: getListId(),
                    listTitleDetails,
                });
            });

            const listId = getListId();
            const type = getTypeIndexFromCustomList(listId).type;

            if (listId && type) {
                const existing = decompressString(localStorage.getItem(`${type}${listId}`));

                if (existing) {
                    const parsedExisting = JSON.parse(existing);
                    const newArr = [...parsedExisting, ...arr];
                    const compressedNewArr = compressString(JSON.stringify(newArr));
                    localStorage.setItem(`${type}${listId}`, compressedNewArr);
                } else {
                    const compressedNewArr = compressString(JSON.stringify(arr));
                    localStorage.setItem(`${type}${listId}`, compressedNewArr);
                }
            }
        }
    }

    // clear localStorage keys where keys begin with w/c/d (for previously saved stories) from probably previous backups
    // x is letter for custom lists, y is for followed lists
    function clearListRelatedStorageItems (customList = false) {
        const keys = Object.keys(localStorage);

        let targetArr = [];

        if (!customList) {
            targetArr = ['w', 'c', 'd']
        } else {
            targetArr = ['x', 'y']
        }

        for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            const match = targetArr.indexOf(keys[i].charAt(0)) !== -1;

            if (match) {
                localStorage.removeItem(keys[i]);
            }
        }
    }

    // other related items saved
    function clearLocalStorageItems (specific = []) {
        const items = [
            'backupMode', // trigger check for doing page by page backup
            'totalPages', // key for total number of pagination per list type
            'backupTime', // latest available backup time
            'generate', // generate boolean for custom list
        ]

        const finalArrayToTarget = specific.length > 0 ? specific : items

        finalArrayToTarget.forEach(item => {
            localStorage.removeItem(item)
        })
    }

    // sortable list will be seen as a tab next to [Done Reading] list and can be triggered when number of stories < idealLimit
    function appendSortableList() {
        const count = getAllBackup().finalCount;

        if (!$('#navCustom')[0]) {
            $('#collection-nav').append(`
                <div id="navCustom" class="nav sub nav-custom">
                    Sortable List
                </div>
            `)

            $('body').append(`<style>
                #collection-nav .nav-custom {
                    background-color: #0069ed;
                    color: #ffffff;
                    cursor: pointer;
                    transition: .2s;
                }

                #collection-nav .nav-custom:hover {
                    background-color: #ffffff;
                    color: #0069ed;
                    cursor: pointer;
                }
            </style>`)

            // Clicking the tab redirects to `/manga/4/` an unuse\/4d url, so I just decided to dump backed up stories there
            $('#navCustom').on('click', () => {
                if (getUserId() !== undefined) {
                    if (count >= idealLimit) {
                        const proceed = confirm('Your have more than 1000 stories. The sortable list might be slow, or might not work properly at all. Proceed anyway?')

                        if (proceed) {
                            window.location.replace(`https://www.mangago.me/home/people/${getUserId()}/manga/4/`);
                        }
                    } else {
                        window.location.replace(`https://www.mangago.me/home/people/${getUserId()}/manga/4/`);
                    }
                } else {
                    alert('Error: your userId cannot be obtained. Be sure you are on a url where people/1234567/manga... is visible')
                }
            })
        }

    }

    // string compression to save space. read more about it over at: https://pieroxy.net/blog/pages/lz-string/index.html
    function compressString(string) {
        if (LZString) {
            return LZString.compressToUTF16(string)
        } else {
            throw new Error ('lz-string plugin missing')
        }
    }

    function decompressString(string) {
        if (LZString) {
            return LZString.decompressFromUTF16(string);
        } else {
            throw new Error ('lz-string plugin missing')
        }
    }

    // Tags are usually filled with emoticons and special characters. cleaning function for tag identifier when filtering sort view
    function cleanAndHyphenateTag(tag) {
        return tag.replace(/\W/g, '').replace(/ +/g, '-').toLowerCase();
    }

    // Params are what we see on URLs after the main link. http://sample.com/?paramSample=1
    // this can be extracted on the page and this will become a variable named paramSample with a value of 1
    function getUrlWithoutParams() {
        return window.location.href.split(/[?#]/)[0]
    }

    // mgg currently has use url formatted like this: https://www.mangago.me/home/people/1234567/
    // I'm getting the id part with this function
    function getUserId() {
        const url = window.location.href.split('/')
        const isAturlWithUserId = url.some(urlPart => {
            return urlPart === "people"
        })

        if (isAturlWithUserId) {
            const targetIndex = url.indexOf("people") + 1
            return url[targetIndex]
        } else {
            return undefined
        }
    }

    // get Id for custom lists. hereby defining custom lists as any lists that are not want to read/reading/done
    function getListId() {
        const url = window.location.href.split('/')
        const isAturlWithUserId = url.some(urlPart => {
            return urlPart === "mangalist"
        })

        if (isAturlWithUserId) {
            const targetIndex = url.indexOf("mangalist") + 1
            return url[targetIndex]
        } else {
            return undefined
        }
    }

    // detect if part of url has pattern pertaining to custom lists
    function isForCustomLists() {
        const url = window.location.href.split('/');
        const isCustom = url.some(urlPart => urlPart === 'list' || urlPart === 'mangalist');
        return isCustom;
    }

    // used when retrieving the stored items into localStorage.
    // targets localStorage items that start with w/c/d as set by previous backup
    function getListFromStorage(letterId, custom = false, fetchMainDetails = false) {
        const keys = Object.keys(localStorage);

        let finalKeys = keys.filter((key) => {
            if (custom) {
                if (fetchMainDetails) {
                    return key.charAt(0) === letterId && key.match(/(-d)/gm)
                } else {
                    return key.charAt(0) === letterId && !key.match(/(-d)/gm)
                }
            }

            return key.charAt(0) === letterId
        })

        const finalArr = []

        finalKeys.forEach(key => {
            finalArr.push(JSON.parse(decompressString(localStorage.getItem(key))))
        })

        return finalArr.flat()
    }

    // compiles all lists from storage
    function getAllBackup() {
        const wantToRead = getListFromStorage('w');
        const currentlyReading = getListFromStorage('c');
        const alreadyRead = getListFromStorage('d');

        const finalObj = {
            wantToRead,
            currentlyReading,
            alreadyRead
        }

        const allData = [
            {
                arr: wantToRead,
                id: 'wantToRead'
            },
            {
                arr: currentlyReading,
                id: 'currentlyReading'
            },
            {
                arr: alreadyRead,
                id: 'alreadyRead'
            },
        ]

        return {
            allData,
            finalObj,
            finalCount: wantToRead.length + currentlyReading.length + alreadyRead.length
        }
    }

    function getAllBackupCustom() {
        const created = getListFromStorage('x', true);
        const followed = getListFromStorage('y', true);
        const createdDetails = getListFromStorage('x', true, true);
        const followedDetails = getListFromStorage('y', true, true);

        const finalObj = {
            created,
            followed,
            mainDetails: [...createdDetails, ...followedDetails]
        }

        const allData = [
            {
                arr: created,
                id: 'created'
            },
            {
                arr: followed,
                id: 'followed'
            },
        ]

        return {
            allData,
            finalObj,
        }
    }

    // function for escaping double quotes (") and commas (,) on tricky CSV formats
    // see rules over at https://en.wikipedia.org/wiki/Comma-separated_values#Basic_rules
    function escape(value) {
        if(!['"','\r','\n',','].some(e => value.indexOf(e) !== -1)) {
            return value;
        }

        return '"' + value.replace(/"/g, '""') + '"';
    }

    // attaches all the fetched data into a clickable link that is shaped like a button
    // attached near the header on the user profile page when a previous successful backup is available
    function generateDownloadLinksToBackup() {
        const rows = []

        const allBackup = getAllBackup()

        allBackup.allData.forEach(item => {
            item.arr.forEach(subitem => {
                const { title, author, link, cover, timestamp, note, rating, tags } = subitem
                let finalRating = -1

                if (rating) {
                    finalRating = rating
                }

                rows.push([
                    escape(title ? title.toString(): ""),
                    escape(author ? author.toString(): ""),
                    escape(link ? link.toString(): ""),
                    escape(cover ? cover.toString(): ""),
                    escape(timestamp ? timestamp.toString(): ""),
                    escape(note.text ? note.text.toString() : ""),
                    escape(finalRating ? finalRating.toString(): ""),
                    escape(tags ? tags.join(',').toString(): ""),
                    escape(item.id ? item.id.toString() : ""),
                ])
            })
        })

        const latestBackupTime = localStorage.getItem('backupTime');
        const fileSafeBackupTime = latestBackupTime.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // CSV handling
        let csvString = rows.map(e => e.join(",")).join("\n")
        let universalBOM = "\uFEFF";
        let csvContent = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csvString);

        let downloadLinkCsv = document.createElement("a");
        downloadLinkCsv.href = csvContent;
        downloadLinkCsv.download = `list-backup-user${getUserId()}-${fileSafeBackupTime}.csv`;
        downloadLinkCsv.classList.add('c-btn');
        downloadLinkCsv.classList.add('download-link');
        downloadLinkCsv.id = 'downloadCsv';
        downloadLinkCsv.text = 'Download CSV';

        $('.info').find("h1").after(downloadLinkCsv);

        // JSON data handling
        let jsonContent = "data:text/json;charset=utf-8," + "\ufeff" + encodeURIComponent(JSON.stringify(allBackup.finalObj));

        let downloadLinkJson = document.createElement("a");
        downloadLinkJson.href = jsonContent;
        downloadLinkJson.download = `list-backup-user${getUserId()}-${fileSafeBackupTime}.json`;
        downloadLinkJson.classList.add('c-btn');
        downloadLinkJson.classList.add('download-link');
        downloadLinkJson.id = 'downloadJson';
        downloadLinkJson.text = 'Download JSON';

        $('.info').find("h1").after(downloadLinkJson);

        $('.info').find("h1").after(`<span style="display: block; margin-right: 12px; color: #06E8F6; font-size: 16px;">Latest Backup (${latestBackupTime}): </span>`);

        $('body').append(`<style>
            #downloadJson.c-btn {
                top: 70px;
            }

            .download-link {
                margin-right: 15px;
                margin-top: 12px;
            }
        </style>`)
    }

    // same as above but for custom lists
    function generateDownloadLinksToBackupCustom() {
        const rows = []

        const allBackup = getAllBackupCustom()
        const finalObj = allBackup.finalObj

        allBackup.allData.forEach(item => {
            item.arr.forEach(subitem => {
                const { title, author, link, cover, timestamp, note, rating, tags, index, listId } = subitem;
                let finalRating = -1;

                if (rating) {
                    finalRating = rating;
                }

                let targetList = finalObj.mainDetails.filter(item => item.listId === listId)[0];

                rows.push([
                    escape(title ? title.toString(): ""),
                    escape(author ? author.toString(): ""),
                    escape(link ? link.toString(): ""),
                    escape(cover ? cover.toString(): ""),
                    escape(timestamp ? timestamp.toString(): ""),
                    escape(note.text ? note.text.toString() : ""),
                    escape(finalRating ? finalRating.toString(): ""),
                    escape(tags ? tags.join(',').toString(): ""),
                    escape(index ? index.toString(): ""),
                    escape(listId ? listId.toString(): ""),
                    escape(targetList.title ? targetList.title.text.toString() : ""),
                    escape(item.id ? item.id.toString() : ""),
                ])
            })
        })

        const latestBackupTime = localStorage.getItem('backupTimeCustom');
        const fileSafeBackupTime = latestBackupTime.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // CSV handling
        let csvString = rows.map(e => e.join(",")).join("\n")
        let universalBOM = "\uFEFF";
        let csvContent = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csvString);

        let downloadLinkCsv = document.createElement("a");
        downloadLinkCsv.href = csvContent;
        downloadLinkCsv.download = `list-backup-user${getUserId()}-${fileSafeBackupTime}.csv`;
        downloadLinkCsv.classList.add('c-btn');
        downloadLinkCsv.classList.add('download-link');
        downloadLinkCsv.id = 'downloadCsv';
        downloadLinkCsv.text = 'Download Custom List CSV';

        $('.info').find("h1").after(downloadLinkCsv);

        // JSON data handling
        let jsonContent = "data:text/json;charset=utf-8," + "\ufeff" + encodeURIComponent(JSON.stringify(allBackup.finalObj));

        let downloadLinkJson = document.createElement("a");
        downloadLinkJson.href = jsonContent;
        downloadLinkJson.download = `list-backup-user${getUserId()}-${fileSafeBackupTime}.json`;
        downloadLinkJson.classList.add('c-btn');
        downloadLinkJson.classList.add('download-link');
        downloadLinkJson.id = 'downloadJson';
        downloadLinkJson.text = 'Download Custom List JSON';

        $('.info').find("h1").after(downloadLinkJson);

        $('.info').find("h1").after(`<span style="display: block; margin-right: 12px; color: #06E8F6; font-size: 16px;">Latest Custom List Backup (${latestBackupTime}): </span>`);

        $('body').append(`<style>
            #downloadJson.c-btn {
                top: 70px;
            }

            .download-link {
                margin-right: 15px;
                margin-top: 12px;
            }
        </style>`)
    }

    // on sortable list view, when a story card is not visible on the screen, do not load image yet
    // load only when the user scrolls onto the said card
    function createObserver(targetEl) {
        let observer;

        let options = {
          root: null,
          rootMargin: "0px",
        };

        // IntersectionObserver is an API that detects elements' visual visibility on screen
        // read more about it at https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const $el = $(targetEl);
                    const $wrapper = $el.find('.art-wrapper');
                    const $img = $wrapper.find('img');
                    const newSrc = $img.data('src');
                    $img.attr("src", newSrc);
                    $wrapper.addClass("img-loaded");
                    observer.unobserve(targetEl);
                }
            })
        }, options);
        observer.observe(targetEl);
    }

    // gets URL parameters in any given link
    function getUrlParams() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        return params
    }

    // for fetching existing custom lists' data from local storage
    function getCustomLists() {
        const listsCreated = decompressString(localStorage.getItem('listsCreated')) || undefined; // FIXME prolly
        const listsFollowed = decompressString(localStorage.getItem('listsFollowed')) || undefined; // FIXME prolly

        const stringified = {
            created: listsCreated,
            followed: listsFollowed
        }

        const parsed = {
            created: listsCreated ? JSON.parse(listsCreated) : undefined,
            followed: listsFollowed ? JSON.parse(listsFollowed) : undefined
        }

        return {
            stringified,
            parsed
        };
    }

    // detects if custom list is 'created' or 'followed' + returns index
    function getTypeIndexFromCustomList(id) {
        if (!id) { return undefined };
        const customLists = getCustomLists();

        const indexCreated = customLists.parsed.created.indexOf(id);

        if (indexCreated !== -1) {
            return {
                type: 'x',
                index: indexCreated
            }
        }

        const indexFollowed = customLists.parsed.followed.indexOf(id);

        if (indexFollowed !== -1) {
            return {
                type: 'y',
                index: indexFollowed
            }
        }

        return {
            type: undefined,
            index: -1
        };
    }

    // gets contents of a list (details and content) given its id
    function getListIdContents(id) {
        if (!id) {return undefined};

        const keys = Object.keys(localStorage);

        const r = new RegExp(`${id}`)
        let isContentAvailable = keys.some((key) => {
            return key.match(r)
        })

        if (isContentAvailable) {
            const check = `${getTypeIndexFromCustomList(id).type}${id}`
            const d = `${check}-d`;

            const mainDetailsKey = keys.filter(key => key === d);
            const contentKey = keys.filter(key => key === check);

            return {
                mainDetails: JSON.parse(decompressString(localStorage.getItem(mainDetailsKey))),
                content: JSON.parse(decompressString(localStorage.getItem(contentKey))),
            }
        }

        return undefined;
    }

    // checks if sortable view caters to a specific custom list
    function checkIfCustomSortableMode() {
        const urlWithoutParams = getUrlWithoutParams();
        if (urlWithoutParams.match(/(manga\/4\/)/gm)) {
            const splitUrl = urlWithoutParams.split('/').filter(item => item !== '');

            let flag = false;

            if (splitUrl[splitUrl.length - 1] != 4) {
                flag = true
            }

            return flag;
        } else {
            return false
        }
    }

    // only start checking for backups/backup-ing when window has finished loading
    window.onload = function () {
        if (typeof jQuery === "undefined") {
            // copied from below, function-ify
            // added to catch lists where list is added to custom lists but goes to 404
            let typeIndex = getTypeIndexFromCustomList(getListId());

            let nextTarget = typeIndex.index + 1;

            const customLists = getCustomLists();
            const { parsed } = customLists;
            const { created, followed } = parsed;

            // x = created custom lists
            if (typeIndex.type === 'x') {
                if (created[nextTarget]) {
                    let targetUrl = `https://www.mangago.me/home/mangalist/${created[nextTarget]}/?filter=&page=1`;
                    window.location.replace(targetUrl);
                } else {
                    if (followed[0]) {
                        let targetUrl = `https://www.mangago.me/home/mangalist/${followed[0]}/?filter=&page=1`;
                        window.location.replace(targetUrl);
                    }
                }
            }

            // y = followed created lists
            if (typeIndex.type === 'y') {
                if (followed[nextTarget]) {
                    let targetUrl = `https://www.mangago.me/home/mangalist/${followed[nextTarget]}/?filter=&page=1`
                    window.location.replace(targetUrl);
                } else {
                    //finalizing storage keys for ending backup process
                    localStorage.setItem('backupTimeCustom', new Date().toLocaleString());
                    localStorage.setItem('backupModeCustom', 'off');
                    localStorage.removeItem('totalPages');

                    alert('backup done! Redirect to list page after clicking okay');
                    const userId = localStorage.getItem('backupUser');
                    localStorage.setItem('generate', 'yes');
                    window.location.replace(`https://www.mangago.me/home/people/${userId}/list/`)
                }
            }
        } else {
            // add custom button styles
            $('body').append(`<style>
                .c-btn {
                    display: inline-block;
                    border: none;
                    padding: 8px 16px;
                    text-decoration: none;
                    background: #0069ed;
                    color: #ffffff;
                    font-family: sans-serif;
                    font-size: 1rem;
                    cursor: pointer;
                    text-align: center;
                    transition: background 250ms ease-in-out,
                    transform 150ms ease;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                }

                .c-btn:hover,
                .c-btn:focus {
                    background: #0053ba;
                }

                .c-btn:focus {
                    outline: 1px solid #fff;
                    outline-offset: -4px;
                }

                .c-btn:active {
                    transform: scale(0.99);
                }

                .c-btn-backup {
                    padding: 0.5rem 1rem;

                    background-color: green;
                }

                .c-btn-backup:hover {
                    background-color: #09ab09;
                }

                .c-btn-backup:focus {
                    background-color: #09ab09;
                }

                .c-btn-reset {
                    padding: 0.5rem 1rem;

                    background-color: #c74242;
                }

                .c-btn-reset:hover {
                    background-color: #fb5757;
                }

                .c-btn-reset:focus {
                    background-color: #fb5757;
                }

                .user-profile h1 {
                    margin-bottom: 15px;
                }

                .user-profile h1 button {
                    margin-left: 10px;
                }
            </style>`)

            // add check for custom lists
            const custom = isForCustomLists() || checkIfCustomSortableMode();

            const latestBackup = (localStorage.getItem(custom ? 'backupTimeCustom' : 'backupTime'));
            // const backupUser = (localStorage.getItem('backupUser'));

            if (latestBackup && !isForCustomLists() && !checkIfCustomSortableMode()) {
                generateDownloadLinksToBackup();

                appendSortableList();
            }

            // detects if user is on a custom list page and checks if there is current available data for sort view
            if (
                isForCustomLists()
                && getListIdContents(getListId())
                && localStorage.getItem('backupModeCustom') === 'off'
                && localStorage.getItem('backupUser')
            ) {
                $('.w-title').find('h1').append(`<button id="customListSortable" class="c-btn" style="margin-left: 12px;">Sortable List</button>`)

                $('#customListSortable').on('click', () => {
                    let targetUrl = `https://www.mangago.me/home/people/${localStorage.getItem('backupUser')}/manga/4/${getListId()}/`;
                    window.location.replace(targetUrl);
                })
            }

            // code block responsible for sortable list view
            if (window.location.href.match(/(manga\/4\/)/gm)) {
                let customListId = undefined;

                const urlWithoutParams = getUrlWithoutParams();
                const splitUrl = urlWithoutParams.split('/').filter(item => item !== '');

                if (splitUrl[splitUrl.length - 1] !== 4) {
                    customListId = splitUrl[splitUrl.length - 1]
                }

                // take into consideration custom mode
                const customListIdContent = checkIfCustomSortableMode() ? getListIdContents(customListId) : undefined;

                const typeIndex = getTypeIndexFromCustomList(customListId);

                const allBackup = customListIdContent ? {
                    allData: [{
                        arr: customListIdContent.content
                    }],
                    finalObj: {
                        created: typeIndex.type === 'x' ? customListIdContent.content : [],
                        followed: typeIndex.type === 'y' ? customListIdContent.content : [],
                        mainDetails: [customListIdContent.mainDetails]
                    }
                } : getAllBackup();

                if (latestBackup) {
                    const allData = allBackup.allData;

                    const allTags = []

                    allData.forEach(item => {
                        item.arr.forEach(subitem => {
                            if (subitem.tags) {
                                if (subitem.tags.length > 0) {
                                    subitem.tags.forEach(tag => {
                                        if (allTags.indexOf(tag) === -1) {
                                            allTags.push(tag)
                                        }
                                    })
                                }
                            }
                        })
                    })

                    $('body').append(`<div id="floatingNote">
                        <div class="note-closer"><span class="emoji emoji274c"></span></div>
                    </div>`)
                    $('body').append(`<style>
                        #floatingNote {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: auto;
                            min-width: 250px;
                            max-width: 500px;
                            height: auto;
                            background: #262730;
                        }

                        #floatingNote.is-active {
                            padding: 15px;
                        }

                        .note-closer .emoji {
                            display: none;
                            position: absolute;
                            top: 0;
                            right: 0;

                            cursor: pointer;
                        }

                        #floatingNote.is-active .note-closer .emoji{
                            display: block;
                        }

                        #floatingNote .tag-wrapper {
                            margin-top: 12px;
                        }

                        #floatingNote .tag {
                            display: inline-block;
                            background-color: #28F;
                            border-radius: 2px;
                            font-size: 14px;
                            color: white;
                            padding: 2px;
                            margin-right: 2px;
                            margin-bottom: 5px;
                        }
                    </style>`)

                    $('.note-closer').on('click', (i, el) => {
                        $('#floatingNote').find('.info.summary').remove();
                        $('#floatingNote').hide()
                        $('#floatingNote').removeClass('is-active')
                    })

                    // repeats over every single saved story card and creates the HTML for the story card
                    const allContentHtml = allData.map(item => {
                        return item.arr.map(subitem => {
                            const { title, link, cover, timestamp, author, rating, tags, note } = subitem

                            let ratingWidth = 0;

                            switch (rating) {
                                case 1:
                                    ratingWidth = 11;
                                    break;
                                case 2:
                                    ratingWidth = 22;
                                    break;
                                case 3:
                                    ratingWidth = 33;
                                    break;
                                case 4:
                                    ratingWidth = 44;
                                    break;
                                case 5:
                                    ratingWidth = 55;
                                    break;
                                default:
                                    break;
                            }

                            const pixelPlaceholder = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEVHcEyC+tLSAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=`;

                            return `<div class="${`element-item-outer ${item.id} ${rating}-star ${
                                tags.map(tag => {
                                    return (cleanAndHyphenateTag(tag)) + " "
                                }).join('')
                            }`}" data-category="${item.id}">
                                ${note.text
                                    ?  `<div class="note-trigger" data-note-html="${
                                        note.html.replace(/(")/gm, '&quot;')}" data-tags="${tags.join(',').replace(/(")/gm, '&quot;')
                                    }"></div>`
                                    : ``
                                }
                                <div class="element-item-inner">
                                    <div class="element-item">
                                        <div class="art-wrapper">
                                            <a href="${link}">
                                                <img id="${title.split(/\s/g).join('').replace(/[^a-zA-Z ]/g, '')}" src="${pixelPlaceholder}" data-src="${cover}" alt="${title + ' ' + cover}" />
                                            </a>
                                        </div>
                                        <div class="details">
                                            <h3 class="title">
                                                <a href="${link}" title="${title}">
                                                    ${title.substring(0, 40).trim()}${title.length >= 40 ? '...' : ''}
                                                </a>
                                            </h3>
                                            <p class="artist" title="${author}">by ${author.substring(0, 20).trim()}${author.length >= 20 ? '...' : ''}</p>
                                            <p class="rating" style="display: none;">${rating !== undefined ? rating : -1}</p>

                                            <div style="display: none;">${note.text}</div>

                                            ${
                                                !customListIdContent
                                                    ? rating !== undefined
                                                        ? rating !== -1
                                                            ? `<div class="stars9" id="stars0"><div class="stars9" id="stars5" style="width:${ratingWidth}px;background-position:0 -9px;margin-bottom: 14px;"></div></div>
                                                                <div style="padding: 4px;"></div>`
                                                            : ``
                                                        : ``
                                                    : rating !== undefined
                                                        ? `<div class="non-star-rating">${rating}/10.0</div>`
                                                        : ``
                                            }

                                            <div className="tag-wrapper">${
                                                tags.map(tag => {
                                                    return `<span class="tag">${tag}</span>`
                                                }).join('')
                                            }</div>

                                            <!-- add notes and tags flippable card -->
                                            <p class="date">${timestamp}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        }).join('')
                    }).join('')


                    $('body').append(`<style>
                        .rightside {
                            display: none !important;
                        }

                        #back_top {
                            display: none !important;
                        }

                        .article {
                            width: 100% !important;
                        }

                        #page.widepage {
                            width: calc(100% - 60px);
                        }

                        .non-star-rating {
                            margin-top: -8px;
                            color: #FBFA7C;
                            margin-bottom: 4px;
                        }
                    </style>`)

                    if (allBackup.finalCount >= idealLimit) {
                        $('.article').find('.content').append(`<h1 style="color: #ff7979; margin-bottom: 20px;">Warning: You currently have more than 1000 stories. Sortable view is not optimized for too many stories, hence the degraded performance.</h1>`);
                    }

                    let mainDetails = undefined;

                    if (customListIdContent) {
                        mainDetails = customListIdContent.mainDetails;
                    }

                    // creates the HTML elements needed for the sortable list view filter/sort/search UI
                    $('.article').find('.content').append(`
                        <div>
                            ${
                                customListIdContent
                                    ? `
                                        <div style="margin-bottom: 20px;">
                                            <a class="c-btn" href="${`https://www.mangago.me/home/mangalist/${mainDetails.listId}/`}">Return to Current List</a>
                                            <a class="c-btn" href="${`https://www.mangago.me/home/people/${getUserId()}/list/`}">Return to All Custom Lists</a>
                                        </div>

                                        ${mainDetails.title.html}

                                        <div class="info" style="margin-top: 12px">
                                            <h2 style="margin-bottom:0">
                                                <a href="${`https://www.mangago.me/home/people/${mainDetails.curator.id}/home/`}">
                                                    <span style="color: #ececec; font-size: 18px;">curated by</span>
                                                    <span style="text-decoration: underline; color: #06E8F6; font-size: 18px;">${mainDetails.curator.username}</span>
                                                </a>
                                            </h2>
                                            <span>Create: ${mainDetails.created}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last update: ${mainDetails.updated}</span>
                                        </div>
                                        <div style="max-width: 600px; margin-top: 20px;">
                                            ${mainDetails.description.html}
                                        </div>
                                    `
                                    : ``
                            }
                        </div>

                        <div class="filters">
                            <h2>List + Tags</h2>
                            <div class="button-group" data-filter-group="default">  <button class="button is-checked" data-filter="">show all</button>
                            ${
                                !customListIdContent
                                    ? `<button class="button" data-filter=".wantToRead">Want To Read</button>
                                        <button class="button" data-filter=".currentlyReading">Currently Reading</button>
                                        <button class="button" data-filter=".alreadyRead">Already Read</button>`
                                    : ``
                            }
                                ${
                                    allTags.map((tag) => {
                                        return `<button class="button" data-filter=".${cleanAndHyphenateTag(tag)}">${tag}</button>`
                                    }).join('')
                                }
                            </div>

                            ${
                                !customListIdContent
                                    ?`<h2>Rating</h2>
                                        <div class="button-group" data-filter-group="stars">  <button class="button is-checked" data-filter="">any</button>
                                        <button class="button" data-filter="notUnrated">rated</button>
                                        <button class="button" data-filter=".5-star">5 &bigstar;</button>
                                        <button class="button" data-filter=".4-star">4 &bigstar;</button>
                                        <button class="button" data-filter=".3-star">3 &bigstar;</button>
                                        <button class="button" data-filter=".2-star">2 &bigstar;</button>
                                        <button class="button" data-filter=".1-star">1 &bigstar;</button>
                                    </div>`
                                    : ``
                            }
                        </div>

                        <h2>Sort</h2>
                        <div id="sorts" class="button-group">  <button class="button is-checked" data-sort-by="original-order">original order</button>
                            <button class="button" data-sort-by="title" data-sort-direction="asc">
                                <span>title</span>
                                <span class="chevron bottom"></span>
                            </button>
                            <button class="button" data-sort-by="date" data-sort-direction="desc">
                                <span>date added</span>
                                <span class="chevron"></span>
                            </button>
                            <button class="button" data-sort-by="artist" data-sort-direction="asc">
                                <span>author/artist</span>
                                <span class="chevron bottom"></span>
                            </button>
                            <button class="button" data-sort-by="rating" data-sort-direction="desc">
                                <span>rating</span>
                                <span class="chevron"></span>
                            </button>
                        </div>

                        <h2>Search</h2>
                        <p><input type="text" class="quicksearch" placeholder="Search" /></p>

                        <p class="filter-count"></p>

                        <div class="grid">
                            ${allContentHtml}
                        </div>
                    `)

                    $('.note-trigger').each(function( i, el ) {
                        var $el = $( el );

                        $el.on('click', (e) => {
                            const $this = $(this);

                            if ($this.is(':visible')) {
                                $('#floatingNote').find('.info.summary').remove();
                                $('#floatingNote').hide();
                                $('#floatingNote').removeClass('is-active');
                            }

                            const note = $this.data('note-html');

                            const tags = $this.data('tags');
                            const $floatingNote = $('#floatingNote');

                            if ($floatingNote.find('.short-note')[0]) {
                                $floatingNote.find('.short-note').remove();
                            }

                            if ($floatingNote.find('.tag-wrapper')[0]) {
                                $floatingNote.find('.tag-wrapper').remove();
                            }
                            $floatingNote.append(note);
                            $floatingNote.append(`<div class="tag-wrapper">
                                ${
                                    tags.length > 0 ? tags.split(',').map(tag => {
                                        return `<span class="tag">${tag}</span>`
                                    }).join('') : ''
                                }
                            </div>`)
                            $floatingNote.addClass('is-active');
                            $floatingNote.show();

                            if (e.pageX > window.innerWidth - 250) { // FIXME: make 250 a variable synced to min-width of floatingNote
                                $floatingNote.css('left', e.pageX - 250 + 'px');
                            } else {
                                $floatingNote.css('left', e.pageX + 'px');
                            }

                            if (e.clientY > window.innerHeight - $floatingNote.height()) {
                                $floatingNote.css('top', e.pageY - $floatingNote.height() + 'px');
                            } else {
                                $floatingNote.css('top', e.pageY + 'px');
                            }
                        })
                    })

                    $('body').append(`<style>
                        * { box-sizing: border-box; }

                        body {
                            font-family: sans-serif;
                        }

                        /* ---- button ---- */
                        .button .chevron {
                            border-style: solid;
                            border-width: 0.25em 0.25em 0 0;
                            content: '';
                            display: inline-block;
                            height: 0.45em;
                            left: 0.15em;
                            position: relative;
                            top: 0.35em;
                            transform: rotate(-45deg);
                            vertical-align: top;
                            width: 0.45em;

                            transition: .2s;
                        }

                        .button .chevron.bottom {
                            transform: rotate(135deg);
                        }

                        .button {
                            display: inline-block;
                            padding: 0.5em 1.0em;
                            min-height: 40px;
                            background: #EEE;
                            border: none;
                            border-radius: 7px;
                            background-image: linear-gradient( to bottom, hsla(0, 0%, 0%, 0), hsla(0, 0%, 0%, 0.2) );
                            color: #222;
                            font-family: sans-serif;
                            font-size: 16px;
                            text-shadow: 0 1px white;
                            cursor: pointer;
                        }

                        .button:hover {
                            background-color: #8CF;
                            text-shadow: 0 1px hsla(0, 0%, 100%, 0.5);
                            color: #222;
                        }

                        .button:active,
                        .button.is-checked {
                            background-color: #28F;
                        }

                        .button.is-checked {
                            color: white;
                            text-shadow: 0 -1px hsla(0, 0%, 0%, 0.8);
                        }

                        .button:active {
                            box-shadow: inset 0 1px 10px hsla(0, 0%, 0%, 0.8);
                        }

                        /* ---- button-group ---- */

                        .button-group {
                            margin-bottom: 20px;
                        }

                        .button-group:after {
                            content: '';
                            display: block;
                            clear: both;
                        }

                        .button-group .button {
                            float: left;
                            border-radius: 0;
                            margin-left: 0;
                            margin-right: 1px;
                        }

                        .button-group .button:first-child { border-radius: 0.5em 0 0 0.5em; }
                        .button-group .button:last-child { border-radius: 0 0.5em 0.5em 0; }

                        .content h2 {
                            margin-bottom: 10px;
                        }

                        .quicksearch {
                            padding: 5px;
                            margin-bottom: 25px;
                            font-size: 16px;
                            width: 300px;
                            height: 40px;
                        }

                        /* ---- isotope ---- */

                        .grid {
                            border: 1px solid #333;
                        }

                        /* clear fix */
                        .grid:after {
                            content: '';
                            display: block;
                            clear: both;
                        }

                        /* ---- .element-item ---- */

                        .element-item-outer {
                            position: relative;
                            width: 250px;
                            height: 155px;

                            margin: 5px;

                            perspective: 1000px;
                        }

                        .note-trigger {
                            position: absolute;
                            top: 0;
                            right: 0;
                            z-index: 2;
                            width: 15px;
                            height: 15px;

                            background-color: #f47dbb;

                            cursor: pointer;
                            transition: .2s;
                        }

                        .note-trigger:hover {
                            background-color: #ff002f;
                        }

                        .element-item-inner .is-active {
                            transform: rotateY(180deg);
                        }

                        .element-item-inner {
                            position: relative;
                            transition: transform 0.5s;
                            transform-style: preserve-3d;
                        }

                        .element-item {
                            position: absolute;
                            top: 0;
                            left: 0;

                            -webkit-backface-visibility: hidden; /* Safari */
                            backface-visibility: hidden;
                        }

                        .element-item {
                            display: flex;
                            width: 250px;
                            height: 155px;
                            padding: 10px;
                            background: #353743;
                            color: #262524;

                            -webkit-backface-visibility: hidden; /* Safari */
                            backface-visibility: hidden;
                        }

                        .element-item > * {
                            margin: 0;
                            padding: 0;
                        }

                        .element-item .title a {
                            font-size: 14px;
                            color: #06E8F6;
                        }

                        .element-item .artist {
                            margin-bottom: 8px;
                            font-size: 12px;
                            color: #ddd;
                        }

                        .element-item img {
                            max-width: 90px;
                        }

                        .element-item .art-wrapper {
                            min-width: 90px;
                            height: 135px;
                            margin-right: 10px;
                            overflow: hidden;
                        }

                        .element-item .details {
                            display: flex;
                            flex-grow: 1;
                            flex-direction: column;
                            overflow: hidden;
                        }

                        .element-item .date {
                            font-size: 8px;
                            margin-left: auto;
                            margin-top: auto;
                            color: #b7b7b7;
                        }

                        .element-item .tag-wrapper {
                            display: flex;
                        }

                        .element-item .tag {
                            display: inline-block;
                            background-color: #428be7;
                            border-radius: 2px;
                            font-size: 8px;
                            color: white;
                            padding: 2px;
                            margin-right: 2px;
                            margin-bottom: 5px;
                        }

                        /* .element-item .number {
                            position: absolute;
                            right: 8px;
                            top: 5px;
                        } */
                    </style>`)

                    // Isotope related js

                    // store filter for each button group
                    var buttonFilters = {};

                    // quick search regex
                    var qsRegex;

                    $('.filters').on( 'click', '.button', function() {
                        var $this = $(this);
                        // get group key
                        var $buttonGroup = $this.parents('.button-group');
                        var filterGroup = $buttonGroup.attr('data-filter-group');
                        // set filter for group
                        buttonFilters[ filterGroup ] = $this.attr('data-filter');
                        // Isotope arrange
                        $grid.isotope();
                    });

                    // Initialization of isotope grid. Read more about isotope at: https://isotope.metafizzy.co/
                    var $grid = $('.grid').isotope({
                        itemSelector: '.element-item-outer',
                        layoutMode: 'fitRows',
                        getSortData: {
                            title: '.title',
                            date: '.date',
                            artist: '.artist',
                            rating: '.rating',
                            category: '[data-category]',
                        },
                        filter: function() {
                            var $this = $(this);
                            var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;

                            var isFilterMatched = true;

                            for ( var prop in buttonFilters ) {
                                var filter = buttonFilters[ prop ];
                                // use function if it matches
                                filter = filterFns[ filter ] || filter;
                                // test each filter
                                if ( filter ) {
                                    isFilterMatched = isFilterMatched && $(this).is( filter );
                                }
                                // break if not matched
                                if ( !isFilterMatched ) {
                                    break;
                                }
                            }

                            return searchResult && isFilterMatched;
                        }
                    });

                    var iso = $grid.data('isotope');
                    var $filterCount = $('.filter-count');

                    function updateFilterCount() {
                        $filterCount.text( iso.filteredItems.length + ' items' );
                    }

                    updateFilterCount();

                    $('.element-item-outer').each((i, el) => {
                        createObserver(el);
                    })

                    // filter functions
                    var filterFns = {
                        notUnrated: function() {
                            var number = $(this).find('.rating').text();
                            return parseInt(number, 10) !== -1;
                        }
                    };

                    // bind sort button click
                    $('#sorts').on( 'click', 'button', function() {
                        var $this = $(this);
                        var sortByValue = $this.attr('data-sort-by');
                        $grid.isotope({ sortBy: sortByValue });
                        $grid.isotope();

                        updateFilterCount();
                    });

                    // change is-checked class on buttons
                    $('.button-group').each( function( i, buttonGroup ) {
                        var $buttonGroup = $( buttonGroup );
                        $buttonGroup.on( 'click', 'button', function() {
                            $buttonGroup.find('.is-checked').removeClass('is-checked');
                            $( this ).addClass('is-checked');

                            /* Get the element name to sort */
                            var sortValue = $(this).attr('data-sort-by');

                            /* Get the sorting direction: asc||desc */
                            var direction = $(this).attr('data-sort-direction');

                            /* convert it to a boolean */
                            var isAscending = (direction == 'asc');
                            var newDirection = (isAscending) ? 'desc' : 'asc';

                            /* pass it to isotope */
                            $grid.isotope({ sortBy: sortValue, sortAscending: isAscending });

                            $(this).attr('data-sort-direction', newDirection);

                            $(this).find('.chevron').toggleClass('bottom');
                        });

                        updateFilterCount();
                    });

                    // use value of search field to filter
                    var $quicksearch = $('.quicksearch').keyup( debounce( function() {
                        qsRegex = new RegExp( $quicksearch.val(), 'gi' );
                        $grid.isotope();
                    }, 200 ) );

                    // debounce so filtering doesn't happen every millisecond
                    function debounce( fn, threshold ) {
                        var timeout;
                        threshold = threshold || 100;
                        return function debounced() {
                        clearTimeout( timeout );
                        var args = arguments;
                        var _this = this;
                        function delayed() {
                            fn.apply( _this, args );
                        }
                        timeout = setTimeout( delayed, threshold );
                        };
                    }
                    // end of isotope related js
                }

            } else {
                const userId = getUserId();
                const backupMode = localStorage.getItem(custom ? 'backupModeCustom' : 'backupMode');

                if (userId !== undefined) { // Only do action if user is on an mgg link where userId can be inferred.
                    if (backupMode !== 'on') {
                        const $userH1 = $('.user-profile').find('h1');
                        const btnBackup = `<button id="btnBackup" class="c-btn c-btn-backup">${
                            custom ? 'Create New Custom Backup' : 'Create New Backup'
                        }</button>`;
                        const btnReset = `<button id="btnReset" class="c-btn c-btn-reset">${
                            custom ? 'Reset All Custom' : 'Reset All'
                        }</button>`;

                        if ($userH1[0] !== undefined) {
                            $($userH1).append(btnBackup);
                            $($userH1).append(btnReset);
                        }

                        $('#btnBackup').on('click', () => {
                            if (custom) {
                                localStorage.setItem('backupUser', getUserId());
                            }

                            const initiateBackup = () => {
                                clearListRelatedStorageItems(custom);

                                let targetUrl = `https://www.mangago.me/home/people/${userId}/${custom ? 'list/create' : 'manga/1'}/?backup=on`
                                window.location.replace(targetUrl);
                            }

                            if (latestBackup) { // ask for confirmation when a previous successful backup is available
                                const proceed = confirm("There is an existing backup. Overwrite?");

                                if (proceed) {
                                    clearLocalStorageItems(custom ? ['backupTimeCustom', 'generate'] : ['backupTime']);
                                    if (custom) {
                                        localStorage.removeItem('listsCreated');
                                        localStorage.removeItem('listsFollowed');
                                    }

                                    initiateBackup();
                                }
                            } else {
                                initiateBackup();
                            }
                        });

                        $('#btnReset').on('click', () => {
                            if (latestBackup) { // ask for confirmation when a previous successful backup is available
                                const proceed = confirm("Confirm reset?");

                                if (proceed) {
                                    clearLocalStorageItems(custom ? ['backupTimeCustom', 'generate'] : ['backupTime']);
                                    clearListRelatedStorageItems(custom);

                                    if (custom) {
                                        localStorage.removeItem('listsCreated');
                                        localStorage.removeItem('listsFollowed');
                                        localStorage.removeItem('backupUser');
                                    }
                                    window.location.reload();
                                }
                            } else {
                                clearListRelatedStorageItems(custom);

                                if (custom) {
                                    localStorage.removeItem('listsCreated');
                                    localStorage.removeItem('listsFollowed');
                                    localStorage.removeItem('backupUser');
                                }
                                window.location.reload();
                            }
                        });
                    }

                    // add custom lists into consideration
                    const { backup, page } = getUrlParams();

                    const customLists = getCustomLists();
                    const listsCreated = customLists.stringified.created
                    const listsFollowed = customLists.stringified.followed

                    if (backup === 'on') {
                        // process for initiating saving content by setting specific storage keys for custom lists
                        // get created list ids for backup
                        localStorage.setItem(custom ? 'backupModeCustom' : 'backupMode', 'on');

                        if (custom) {
                            if (getUrlWithoutParams().match(/(create)/gm)) {
                                if (!listsCreated) {
                                    if ($('.left.wrap')[0]) {
                                        let createdArr = []

                                        $('.left.wrap').each((i, el) => {
                                            const $el = $(el);
                                            let splitUrl = $el.attr('href').split('/');
                                            splitUrl = splitUrl.filter(item => item !== "");
                                            const listId = splitUrl[splitUrl.length -1];
                                            createdArr.push(listId);
                                        })

                                        localStorage.setItem('listsCreated', compressString(JSON.stringify(createdArr)));
                                        window.location.replace(`https://www.mangago.me/home/people/${userId}/list/follow/`);
                                    } else {
                                        localStorage.setItem('listsCreated', compressString(JSON.stringify([])));
                                        window.location.replace(`https://www.mangago.me/home/people/${userId}/list/follow/`);
                                    }
                                }
                            }
                        } else {
                            window.location.replace(`https://www.mangago.me/home/people/${userId}/manga/1/?page=1`);
                        }
                    }

                    // do the same for followed custom lists
                    if (backupMode === 'on' && custom && listsCreated && !listsFollowed) {
                        if (getUrlWithoutParams().match(/(follow)/gm)) {
                            // FIXME: functionify above
                            if (!listsFollowed) {
                                if ($('.left.wrap')[0]) {
                                    let followedArr = []

                                    $('.left.wrap').each((i, el) => {
                                        const $el = $(el);
                                        let splitUrl = $el.attr('href').split('/');
                                        splitUrl = splitUrl.filter(item => item !== "");
                                        const listId = splitUrl[splitUrl.length -1];
                                        followedArr.push(listId);
                                    })

                                    localStorage.setItem('listsFollowed', compressString(JSON.stringify(followedArr)));
                                    window.location.reload();
                                } else {
                                    localStorage.setItem('listsFollowed', compressString(JSON.stringify([])));
                                    window.location.reload();
                                }
                            }
                        }
                    }

                    // checks where the user should be on flow process for custom lists and redirects accordingly
                    if (backupMode === 'on' && listsCreated && listsFollowed) {
                        if (JSON.parse(listsCreated).length > 0) {
                            window.location.replace(`https://www.mangago.me/home/mangalist/${JSON.parse(listsCreated)[0]}/?filter=&page=1`)
                        } else if (JSON.parse(listsFollowed).length > 0) {
                            window.location.replace(`https://www.mangago.me/home/mangalist/${JSON.parse(listsFollowed)[0]}/?filter=&page=1`)
                        } else {
                            alert ('nothing to backup, your created/followed lists are empty');
                        }
                    }

                    // actual start of backup, copied from above, edited for custom lists
                    // if (backupMode === 'on') {
                    if (backupMode === 'on' && !custom) {
                        // gets total pagination numbers
                        const totalPagesFromMemory = localStorage.getItem('totalPages');

                        // when no total pages are set, get total pages from pagination data first
                        if (!totalPagesFromMemory) {
                            setTotalPages()
                            window.location.reload();
                        } else {
                            saveList();

                            if (page) {
                                const currentPage = parseInt(page, 10);

                                // will execute saving page by page until it equals the last number on pagination
                                if (currentPage < totalPagesFromMemory) {
                                    const newPage = currentPage + 1;
                                    const newUrl = getUrlWithoutParams() + `?page=${newPage}`;
                                    window.location.replace(newUrl);
                                } else {
                                    // when a list type is done, move on to next list
                                    if (detectList() < 3) {
                                        localStorage.removeItem('totalPages');
                                        window.location.replace(`https://www.mangago.me/home/people/${userId}/manga/${detectList() + 1}/?page=1`);
                                    } else {
                                        // if last list type is done, set backupTime, and backupUser, generate download links
                                        localStorage.setItem('backupTime', new Date().toLocaleString());
                                        localStorage.setItem('backupUser', getUserId());

                                        generateDownloadLinksToBackup();

                                        localStorage.setItem('backupMode', 'off');
                                        localStorage.removeItem('totalPages');
                                        appendSortableList();
                                        alert('backup done! page will refresh one more time to reflect download links');
                                        window.location.reload();
                                    }
                                }
                            }
                        }
                    }

                    const generate = localStorage.getItem('generate');
                    if (custom && generate === 'yes') {
                        generateDownloadLinksToBackupCustom();
                    }
                } else {
                    if (backupMode === 'on' && getUrlWithoutParams().match(/(mangalist)/gm)) {
                        // gets total pagination numbers
                        const totalPagesFromMemory = localStorage.getItem('totalPages');

                        // when no total pages are set, get total pages from pagination data first
                        if (!totalPagesFromMemory) {
                            setTotalPages();
                            window.location.reload();
                        } else {
                            let typeIndex = getTypeIndexFromCustomList(getListId());

                            if (typeIndex.index !== -1) {
                                saveList(custom); //custom type

                                const { page } = getUrlParams()

                                if (page) {
                                    const currentPage = parseInt(page, 10);

                                    if (currentPage < totalPagesFromMemory) {
                                        // TODO: check if not done
                                        const newPage = currentPage + 1;
                                        const newUrl = getUrlWithoutParams() + `?filter=&page=${newPage}`;
                                        window.location.replace(newUrl);
                                    } else {
                                        localStorage.removeItem('totalPages');

                                        let nextTarget = typeIndex.index + 1;

                                        const customLists = getCustomLists();
                                        const { parsed } = customLists;
                                        const { created, followed } = parsed;

                                        // x = created custom lists
                                        if (typeIndex.type === 'x') {
                                            if (created[nextTarget]) {
                                                let targetUrl = `https://www.mangago.me/home/mangalist/${created[nextTarget]}/?filter=&page=1`;
                                                window.location.replace(targetUrl);
                                            } else {
                                                if (followed[0]) {
                                                    let targetUrl = `https://www.mangago.me/home/mangalist/${followed[0]}/?filter=&page=1`;
                                                    window.location.replace(targetUrl);
                                                }
                                            }
                                        }

                                        // y = followed created lists
                                        if (typeIndex.type === 'y') {
                                            if (followed[nextTarget]) {
                                                let targetUrl = `https://www.mangago.me/home/mangalist/${followed[nextTarget]}/?filter=&page=1`
                                                window.location.replace(targetUrl);
                                            } else {
                                                //finalizing storage keys for ending backup process
                                                localStorage.setItem('backupTimeCustom', new Date().toLocaleString());
                                                localStorage.setItem('backupModeCustom', 'off');
                                                localStorage.removeItem('totalPages');

                                                alert('backup done! Redirect to list page after clicking okay');
                                                const userId = localStorage.getItem('backupUser');
                                                localStorage.setItem('generate', 'yes');
                                                window.location.replace(`https://www.mangago.me/home/people/${userId}/list/`)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})();