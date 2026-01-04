// ==UserScript==
// @name         Pixiv Bookmark Tag Summary
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  Count illustrations per tag in bookmarks
// @match        https://www.pixiv.net/*/bookmarks*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516047/Pixiv%20Bookmark%20Tag%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/516047/Pixiv%20Bookmark%20Tag%20Summary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const turboMode = false;
    const bookmarkBatchSize = 100;
    const BANNER = ".sc-x1dm5r-0";
    let uid, lang, token;
    let pageInfo = {};
    let userTags = [];
    // Function to count bookmarks by tag
    let tags = {};
    let sortedTags = [];
    let illustrations = {};
    let bookmarks = {};
    let translations = {};
    let debounceTimer = null;
    let fetchedAll = false;
    let tagTiles = {};

    let globalObjects = {
        userTags: userTags,
        tags: tags,
        sortedTags: sortedTags,
        illustrations: illustrations,
        bookmarks: bookmarks,
        translations: translations,
        uid: uid,
        lang: lang,
        token: token,
        bookmarkBatchSize: bookmarkBatchSize,
        tagTiles: tagTiles
    }

    let unsafeWindow_ = unsafeWindow;
    
    const delay = (ms) => {
        return new Promise((res) => setTimeout(res, ms));
    }
    const splitIntoBatches = (array, batchSize) => {
        const batches = [];
        for (let i = 0; i < array.length; i += batchSize) {
            batches.push(array.slice(i, i + batchSize));
        }
        return batches;
    }

    const reverseObject = (obj) => {
        const reversed = {};
    
        for (let [key, value] of Object.entries(obj)) {
            if (reversed[value]) {
                reversed[value].push(key);
            } else {
                reversed[value] = [key];
            }
        }
    
        return reversed;
    }
    const downloadObject = (obj, name="object.json") => {
        // Convert the transformed dictionary to a JSON string
        let jsonStr = JSON.stringify(obj, null, 4);

        // Create a Blob from the JSON string
        let blob = new Blob([jsonStr], { type: 'application/json' });

        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);  // Append the link to the body
        a.click();  // Trigger the download
        document.body.removeChild(a);  // Remove the link after the download
        URL.revokeObjectURL(url); 
    }

    const fixTagName = (str) => {
        return str.replace(/ /g, "_").slice(0, 20).trim();
    }

    const getTag = (tag) => {
        if (typeof tag == "string"){
            return tags[tag];
        }
        return tag;
    }

    const getTagName = (tag) => {
        if (typeof tag !== "string"){
            return tag.name;
        }
        return tag;
    }
    
    const remove = async (tagNames, bookmarkIds, isBatch=false) => {
        if (!tagNames || !bookmarkIds || tagNames.length == 0 || bookmarkIds.length == 0){
            console.log(`Skip removing tag ${tagNames} from ${bookmarkIds.length} illustrations`);
            return;
        }
        tagNames = tagNames.map(getTagName);
        if (tagNames.length > 1){
            for (const tagName of tagNames) {
                await remove([tagName], bookmarkIds);
            }
            return;
    }
        bookmarkIds = filterBookmarks(tagNames[0], bookmarkIds, false);
        bookmarkIds = filterBookmarks2(tagNames[0], bookmarkIds, false);
        if (!bookmarkIds || bookmarkIds.length == 0){
            console.log(`Skip removing tag ${tagNames} because it has no illustrations`);
            return;
        }
        tagNames = tagNames.map(fixTagName);
        if (bookmarkIds.length > bookmarkBatchSize){
            const batches = splitIntoBatches(bookmarkIds, bookmarkBatchSize);
            for (const batch of batches) {
                await remove(tagNames, batch, true);
            }
            return;
        }
        const payload = { 
            removeTags: tagNames,
            bookmarkIds: bookmarkIds,
        };
        const response = await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/remove_tags", {
            headers: {
                accept: "application/json",
                "content-type": "application/json; charset=utf-8",
                //"content-type": "application/x-www-form-urlencoded; charset=utf-8",
                "x-csrf-token": token,
            },
            body: JSON.stringify(payload),
            //body: new URLSearchParams(payload).toString(),
            method: "POST",
        });
        if (response.ok && !response.error) {
            tagNames.forEach((tagName) => {
                const bookmarks = bookmarkIds.map(id => globalObjects.bookmarks[id]);
                bookmarks.forEach(b => {
                    removeIllust(tagName, b);
                });
            })
            console.log(`Removed ${tagNames} from ${bookmarkIds}`);
        }else{
            throw Error(`Remove of ${tagNames} failed for ${bookmarkIds} with status ${response.status} and error ${response.error}: ${response.message}`);
        }
        await delay(500);
    }
    const includes = (source, negate=false) => {
        let f = x => true;
        if (typeof source === 'object' && !Array.isArray(source) && !(source instanceof Set)) {
            f = key => (key in source);
        }
        if (Array.isArray(source)) {
            f = key => source.includes(key);
        }
        if (source instanceof Set) {
            f = key => source.has(key);
        }
        let f2 = f;
        if (negate){
            f2 = key => !f(key);
        }
        return f2;
    }
    const filterBookmarks = (source, keys, exclusion) => {
        if(typeof source == "string"){
            source = globalObjects.tags[source];
            if (!source) return keys;
            source = source.bookmarks;
            if (!source) return keys;
        }
        let f2 = includes(source, exclusion);
        return keys.filter(f2);
    }
    const filterBookmarks2 = (tagName, bookmarkIds, exclusion) => {
        let bookmarks = bookmarkIds.map(id => globalObjects.bookmarks[id]);
        bookmarks = bookmarks.filter(b => includes(b.associatedTags, exclusion)(tagName));
        return bookmarks.map(b => b.bookmarkId);
    }
    const add = async (tagNames, bookmarkIds, isBatch=false) => {
        if (!tagNames || !bookmarkIds || tagNames.length == 0 || bookmarkIds.length == 0){
            console.log(`Skip adding tag ${tagNames} to ${bookmarkIds.length} illustrations`);
            return tagNames;
        }
        tagNames = tagNames.map(getTagName);
        if (tagNames.length > 1){
            for (const tagName of tagNames) {
                await add([tagName], bookmarkIds);
            }
            return tagNames;
        }
        bookmarkIds = filterBookmarks(tagNames[0], bookmarkIds, true);
        bookmarkIds = filterBookmarks2(tagNames[0], bookmarkIds, true);
        if (!bookmarkIds || bookmarkIds.length == 0){
            console.log(`Skip adding tag ${tagNames} because the illustrations already have it`);
            return tagNames;
        }
        tagNames = tagNames.map(fixTagName);
        if (bookmarkIds.length > bookmarkBatchSize){
            const batches = splitIntoBatches(bookmarkIds, bookmarkBatchSize);
            for (const batch of batches) {
                await add(tagNames, batch, true);
            }
            return tagNames;
        }
        const restrict = window.location.href.includes("rest=hide") ? 1 : 0;
        const payload = { 
            tags: tagNames,
            bookmarkIds: bookmarkIds,
        };
        const response = await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add_tags", {
            headers: {
                accept: "application/json",
                "content-type": "application/json; charset=utf-8",
                //"content-type": "application/x-www-form-urlencoded; charset=utf-8",
                "x-csrf-token": token,
            },
            body: JSON.stringify(payload),
            //body: new URLSearchParams(payload).toString(),
            method: "POST",
        });
        if (response.ok && !response.error) {
            tagNames.forEach((tagName) => {
                const tag = saveTag(tagName);
                const bookmarks = bookmarkIds.map(id => globalObjects.bookmarks[id]);
                bookmarks.forEach(b => {
                    saveIllust(tag, b);
                });
            })
            console.log(`Added ${tagNames} to ${bookmarkIds}`);
        }else{
            throw Error(`Add of ${tagNames} failed for ${bookmarkIds} with status ${response.status} and error ${response.error}: ${response.message}`);
        }
        await delay(500);
        return tagNames;
    }

    const getTagTranslation = async (tag) => {
        const apiBaseUrl = "https://www.pixiv.net/ajax/search/tags/";
        const apiUrl = `${apiBaseUrl}${encodeURIComponent(tag)}?lang=${lang}`;
        let translation = null;

        if (includes(globalObjects.translations)(tag)){
            translation = globalObjects.translations[tag];
            if (translation){
                console.log(`Cached translation: ${tag} -> ${translation}`);
                return translation;
            }
        }

        try {
            // Fetch the tag translation from the API
            if (!translation){
                const response = await fetch(apiUrl, { credentials: 'same-origin' });
                if (!response.ok) {
                    console.error(`Failed to fetch translation for tag: ${tag}`);
                    return null;
                }
    
                // Parse the JSON response
                const json = await response.json();
                if (json.error) {
                    console.error(`API error for tag: ${tag}`, json.message || "Unknown error");
                    return null;
                }
    
                // Extract translation based on the order of preference
                translation =
                    json.body?.tagTranslation?.[tag]?.[lang] ||
                    json.body?.breadcrumbs?.successor?.pop()?.translation?.[lang] ||
                    json.body?.tagTranslation?.[tag]?.en ||
                    json.body?.breadcrumbs?.successor?.pop()?.translation?.en ||
                    json.body?.tagTranslation?.[tag]?.romaji ||
                    json.body?.pixpedia?.tag ||
                    null; // No translation available
            }

            if (translation) {
                translation = fixTagName(translation);
                console.log(`Translated: ${tag} -> ${translation}`);
                translations[tag] = translation;
                return translation;
            } else {
                console.warn(`No translation found for tag: ${tag}`);
                return null;
            }

            // Delay to avoid overloading the server
        } catch (err) {
            console.error(`Error fetching translation for tag: ${tag}`, err);
            return null;
        }finally {
            await delay(500);
        }
        return translation;
    }

    const renameTag = async (tag, newTagName, publicationType=null) => {
        if (!publicationType){
            publicationType = window.location.href.includes("rest=hide") ? "hide" : "show";
        }
        tag = getTag(tag);
        const tagTile = globalObjects.tagTiles[tag.name];
        
        let bookmarkIds = Object.values(tag.bookmarks).map(illust => illust.bookmarkId);

        if (!bookmarkIds || bookmarkIds.length == 0){
            console.log(`Skip renaming tag ${tag.name} -> ${newTagName} because it has no illustrations`);
            return;
        }
            
        newTagName = fixTagName(newTagName);
        if (includes(tagTiles)(newTagName)){
            if (confirm(`Tag ${newTagName} already exists. Do you want to move ${tag.name} into ${newTagName}?`)){
                moveTag(tag.name, newTagName, true);
            }
            return;
        }
        // Update server-side: Add the new tag and remove the old tag
        newTagName = (await add([newTagName], bookmarkIds))[0];
        await remove([tag.name], bookmarkIds);

        // Update the `tags` object
        const oldTagName = tag.name;
        tag.name = newTagName;

        // Update the DOM: Modify the tag tile
        if (tagTile){
            const tagLink = tagTile.querySelector('a'); // Tag link element
            const tagCount = tagTile.querySelector('div:last-child'); // Tag count element
    
            if (tagLink) tagLink.innerText = newTagName; // Update tag name
            if (tagLink) tagLink.href = `https://www.pixiv.net/en/users/${uid}/bookmarks/artworks/${newTagName}?rest=${publicationType}`; // Update URL
            if (tagCount) tagCount.innerText = `(${Object.keys(tag.illustrations).length})`; // Count remains unchanged

            tagTiles[newTagName] = tagTile;
        }

        removeTagLocal(oldTagName, true);
        console.log(`Renamed tag "${oldTagName}" to "${newTagName}".`);
    }


    const deleteArrayElement = (arr, el) => {
        let index = arr.indexOf(el);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }

    const removeTagLocal = (tagName, isRename=false) => {
        deleteArrayElement(userTags, tagName);
        if (!isRename){
            deleteArrayElement(sortedTags, tags[tagName]);
        } 
        delete tags[tagName];
        if (tagTiles[tagName]){
            if (!isRename){
                tagTiles[tagName].remove();
            } 
            delete tagTiles[tagName];
        }
    }

    const removeTags = async (tags) => {
        for (let tag of tags) {
            tag = getTag(tag);
            const illusts = Object.values(tag.illustrations).map((illust) => illust.bookmarkId);
            await remove([tag.name], illusts);
            removeTagLocal(tag.name);
        }
    }

    const sortByParody = (array) => {
        const sortFunc = (a, b) => {
          let reg = /^[a-zA-Z0-9]/;
          if (reg.test(a) && !reg.test(b)) return -1;
          else if (!reg.test(a) && reg.test(b)) return 1;
          else return a.localeCompare(b, "zh");
        };
        const withParody = array.filter((key) => key.includes("("));
        const withoutParody = array.filter((key) => !key.includes("("));
        withoutParody.sort(sortFunc);
        withParody.sort(sortFunc);
        withParody.sort((a, b) => sortFunc(a.split("(")[1], b.split("(")[1]));
        return withoutParody.concat(withParody);
    }

    const fetchUserTags = async () => {
        const tagsRaw = await fetch(
        `/ajax/user/${uid}/illusts/bookmark/tags?lang=${lang}`
        );
        const tagsObj = await tagsRaw.json();
        if (tagsObj.error === true)
        return alert(
            `获取tags失败
        Fail to fetch user tags` +
            "\n" +
            decodeURI(tagsObj.message)
        );
        let userTagDict = tagsObj.body;
        const userTagsSet = new Set();
        const addTag2Set = (tag) => {
            try {
                userTagsSet.add(decodeURI(tag));
            } catch (err) {
                userTagsSet.add(tag);
                if (err.message !== "URI malformed") {
                    console.log("[Label Pixiv] Error!");
                    console.log(err.name, err.message);
                    console.log(err.stack);
                }
            }
        };
        for (let obj of userTagDict.public) {
            addTag2Set(obj.tag);
        }
        for (let obj of userTagDict["private"]) {
            addTag2Set(obj.tag);
        }
        userTagsSet.delete("未分類");
        return sortByParody(Array.from(userTagsSet));
    }
    
    // Function to bulk remove or remove tags based on minimum bookmark count
    const bulkRemove = async (minBookmarks) => {
        // Filter tags based on the bookmark count
        const selectedTags = sortedTags.filter((tag) => {
            const bookmarkCount = countIllusts(tag);
            return bookmarkCount < minBookmarks;
        });

        if (selectedTags.length === 0) {
            alert('No tag meet the criteria.');
            return;
        }

        // Show confirmation dialog
        const confirmation = confirm(`Are you sure you want to remove ${selectedTags.length} tags?`);
        if (!confirmation) return;

        await removeTags(selectedTags);
        alert(`Removed ${selectedTags.length} tags`);
    }
    
    const fetchTokenPolyfill = async () => {
        // get token
        const userRaw = await fetch(
            "/bookmark_add.php?type=illust&illust_id=83540927"
        );
        if (!userRaw.ok) {
            console.log(`获取身份信息失败
            Fail to fetch user information`);
            throw new Error();
        }
        const userRes = await userRaw.text();
        const tokenPos = userRes.indexOf("pixiv.context.token");
        const tokenEnd = userRes.indexOf(";", tokenPos);
        return userRes.slice(tokenPos, tokenEnd).split('"')[1];
    }
    const initializeVariables = async () => {
        const polyfill = async () => {
            try {
                const dataLayer = unsafeWindow_["dataLayer"][0];
                uid = dataLayer["user_id"];
                lang = dataLayer["lang"];
                token = await fetchTokenPolyfill();
                pageInfo.userId = window.location.href.match(/users\/(\d+)/)?.[1];
                pageInfo.client = { userId: uid, lang, token };
            } catch (err) {
                console.log(err);
                console.log("[Label Bookmarks] Initializing Failed");
            }
        }

        try {
            pageInfo = Object.values(document.querySelector(BANNER))[0]["return"][
                "return"
            ]["memoizedProps"];
            uid = pageInfo["client"]["userId"];
            token = pageInfo["client"]["token"];
            lang = pageInfo["client"]["lang"];
            if (!uid || !token || !lang) await polyfill();
        } catch (err) {
            console.log(err);
            await polyfill();
        }

    }
    const fetchBookmarks = async (uid, tagToQuery='', offset=0, publicationType=null) => {
        if (!publicationType){
            publicationType = window.location.href.includes("rest=hide") ? "hide" : "show";
        }
        const bookmarksRaw = await fetch(
            `/ajax/user/${uid}` +
            `/illusts/bookmarks?tag=${tagToQuery}` +
            `&offset=${offset}&limit=${bookmarkBatchSize}&rest=${publicationType}`
        );
        if (!turboMode) await delay(500);
        const bookmarksRes = await bookmarksRaw.json();
        if (!bookmarksRaw.ok || bookmarksRes.error === true) {
            return alert(
            `获取用户收藏夹列表失败\nFail to fetch user bookmarks\n` +
                decodeURI(bookmarksRes.message)
            );
        }
        const bookmarks = bookmarksRes.body;
        bookmarks.count = bookmarks["works"].length;
        const works = bookmarks["works"]
        .map((work) => {
            if (work.title === "-----") return null;
            work.bookmarkId = work["bookmarkData"]["id"];
            work.associatedTags = bookmarks["bookmarkTags"][work.bookmarkId] || []; 
            work.associatedTags = work.associatedTags.filter(
                (tag) => tag != "未分類"
            );
            return work;
        })
        .filter((work) => work && work.associatedTags.length); 
        bookmarks["works"] = works;
        return bookmarks;
    }

    const fetchAllBookmarks = async (uid, tagToQuery='', publicationType=null) => {
        let total, // total bookmarks of specific tag
            index = 0; // counter of do-while loop
        let finalBookmarks = null;
        let allWorks = [];
        let allTags = {}
        do {
            const bookmarks = await fetchBookmarks(
                uid,
                tagToQuery,
                index,
                publicationType
            );
            if (!total) total = bookmarks.total;
            const works = bookmarks["works"];
            allWorks = allWorks.concat(works);
            allTags = updateObject(allTags, bookmarks["bookmarkTags"]);
            index += bookmarks.count || bookmarks["works"].length;
            finalBookmarks = updateObject(finalBookmarks, bookmarks);
            console.log(`Fetching bookmarks... ${index}/${total}`)
        } while (index < total);
        finalBookmarks["works"] = allWorks;
        finalBookmarks["bookmarkTags"] = allTags;
        return finalBookmarks;
    }


    // Function to check if the bookmarks list has changed
    const countIllusts = (tag) => Object.keys(tag.illustrations).length;
    const countBookmarks = (tag) => Object.keys(tag.bookmarks).length;
    const illustComparator = (a, b) => countIllusts(b) - countIllusts(a);

    const updateObject = (target, source) => {
        if (!target) return source;
        //target = {...target, ...source};
        Object.assign(target, source);
        return target;
    }

    const saveTag = (tag) => {
        tag = getTagName(tag);
        if (!tags[tag]){
            userTags.push(tag);
            tags[tag] = {
                name: tag,
                illustrations: {},
                bookmarks: {},
            };
        }
        return tags[tag];
    }
    const saveIllust = (tag, illust) => {
        tag = saveTag(tag);
        let illustId = illust.id;
        if (tag.illustrations[illustId]) {
            tag.illustrations[illustId] = updateObject(tag.illustrations[illustId], illust);
            illust = tag.illustrations[illustId];
        }else{
            tag.illustrations[illustId] = illust;
        }
        illustrations[illustId] = illust;
        let bookmarkId = illust.bookmarkId;
        if (tag.bookmarks[bookmarkId]) {
            tag.bookmarks[bookmarkId] = updateObject(tag.bookmarks[bookmarkId], illust);
            illust = tag.bookmarks[bookmarkId];
        }else{
            tag.bookmarks[bookmarkId] = illust;
        }
        bookmarks[bookmarkId] = illust;
        return illust;
    }

    const removeIllust = (tag, illust) => {
        tag = getTag(tag);
        if (!tag) return;
        delete tag.illustrations[illust.id];
        delete tag.bookmarks[illust.bookmarkId];
        if (countIllusts(tag) == 0){
            removeTags([tag]);
        }
    }

    const summarizeAllBookmarks = async () => {
        
        userTags = await fetchUserTags();
        userTags.forEach((tag) => {
            saveTag(tag);
        });

        const bookmarks = await fetchAllBookmarks(uid);
        console.log(`Fetched ${bookmarks.works.length} bookmarks`);
        
        let total = 0;
        bookmarks["works"].forEach((work) => {
            let illust = {
                id: work.id,
                title: work.title,
                alt: work.alt,
                img: work.url,
            };
            illust = updateObject(illust, work);
            illust["url"] = `https://www.pixiv.net/${lang}/artworks/${work.id}`;
            work.associatedTags.forEach((tag) => {
                saveIllust(tag, illust);
            });
            total += 1;
        });
        console.log(`Processed ${total} illusts with ${Object.keys(tags).length} tags`);
        sortTags();
        fetchedAll = true;
        requestAnimationFrame(renderSummary);
        //renderSummary();
    }

    const sortTags = () =>{
        sortedTags = Object.values(tags).sort(illustComparator);
        globalObjects.sortedTags = sortedTags;
    }

    const moveTag = async (tag, targetTagName, forceRemove=false) => {
        // Add the dragged tag (A) to all illustrations in the target tag (B)
        tag = getTag(tag);
        const targetTag = tags[targetTagName];
        const bookmarkIds = Object.values(tag.illustrations).map(illust => illust.bookmarkId);
        await add([targetTagName], bookmarkIds);
        populateTagTile(targetTag);
        console.log(`Tag "${targetTagName}" added to all illustrations in "${tag.name}".`);

        if (forceRemove || confirm(`Do you want to remove the "${tag.name}" tag?`)) {
            await removeTags([tag.name]);
            if (!forceRemove) alert(`Tag "${tag.name}" removed.`);
        }
        sortTags();
    }

    //populate tag tile
    const populateTagTile = (tag) => {
        tag = getTag(tag);

        const tagTile = tagTiles[tag.name];
        if (!tagTile) return;

        const count = countIllusts(tag);
        const tagCount = tagTile.querySelector(".tag-count");
        tagCount.innerText = `(${count})`;

        const illustContainer = tagTile.querySelector(".illust-container")
        illustContainer.innerHTML = "";
        // Populate illustrations
        Object.values(tag.illustrations).forEach((illust) => {
            const illustItem = document.createElement('li');
            illustItem.style.marginBottom = '5px';
            illustItem.innerHTML = `<a href="${illust.url}" target="_blank">${illust.alt || illust.title}</a>`;
            illustContainer.appendChild(illustItem);
        });
    }

    // Function to render the summary UI
    const renderSummary = () => {
        let publicationType = window.location.href.includes("rest=hide") ? "hide" : "show";
        // Clear previous summary if exists
        const existingSummary = document.getElementById('tag-summary');
        if (existingSummary) {
            existingSummary.remove();
        }
        // Create a summary element
        const summaryDiv = document.createElement('div');
        summaryDiv.id = 'tag-summary'; // Set an ID for easy removal
        summaryDiv.style.position = 'fixed';
        summaryDiv.style.bottom = '10px';
        summaryDiv.style.right = '10px';
        summaryDiv.style.backgroundColor = '#fff';
        summaryDiv.style.padding = '10px';
        summaryDiv.style.border = '1px solid #ccc';
        summaryDiv.style.zIndex = '9999';
        summaryDiv.style.color = 'black';

        const title = document.createElement('h3');
        title.innerText = 'Tags';
        title.style.cursor = 'pointer'; // Change cursor to pointer
        title.style.margin = '0'; // Remove default margin

        // Create a container for tag data
        const summaryContent = document.createElement('div');
        summaryContent.style.display = 'none'; // Initially hidden
        summaryContent.style.padding = '10px';
        summaryContent.style.maxHeight = '400px'; // Set a maximum height
        summaryContent.style.minWidth = '400px';
        summaryContent.style.overflowY = 'auto'; // Enable vertical scrolling

        // Toggle visibility of the tag container when the title is clicked
        title.addEventListener('click', () => {
            if (summaryContent.style.display === 'none') {
                summaryContent.style.display = 'block';
                title.innerText = 'Tags'; // Change title when expanded
            } else {
                summaryContent.style.display = 'none';
                title.innerText = 'Tags'; // Reset title when collapsed
            }
        });

        let totalCount = 0;
        const tagContainer = document.createElement('div');
        tagContainer.style.display = 'grid';
        tagContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
        tagContainer.style.gap = '10px';
    
        // Keep track of the currently expanded tile
        let expandedTile = null;
        // Generate each tag as a tile with clickable illustration list

        Object.keys(tagTiles).forEach(key => delete tagTiles[key]);
        Object.values(sortedTags).forEach((tag) => {
            const count = countIllusts(tag);
            if (!count) return;
    
            const tagTile = document.createElement('div');
            tagTile.style.backgroundColor = '#f0f0f0';
            tagTile.style.padding = '5px';
            tagTile.style.borderRadius = '5px';
            tagTile.style.textAlign = 'center';
            tagTile.style.cursor = 'pointer';
            tagTile.style.transition = 'all 0.3s ease';
            tagTile.style.position = "relative"; /*add this*/
            tagTile.style.color = 'black';
            tagTile.draggable = true;  // Enable dragging

            // Store the tag name in the element's dataset for easy reference during drag and drop
            tagTile.dataset.tagName = tag.name;

            tagTiles[tag.name] = tagTile;
            tagTile.tag = tag;

            // Dragstart is triggered on the dragged element
            tagTile.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', tag.name);
            });

            tagTile.addEventListener('dragover', (e) => {
                e.preventDefault(); 
            });

            // drop and dragover are triggered on the below element
            tagTile.addEventListener('drop', async (e) => {
                e.preventDefault();
                const targetTagName = tag.name;
                const draggedTagName = e.dataTransfer.getData('text/plain');
                console.log(draggedTagName, targetTagName);
                if (draggedTagName === targetTagName) return;
                // Confirm addition of the dragged tag to target tag's illustrations
                if (!confirm(`Do you want to move "${draggedTagName}" tag to "${targetTagName}" tag?\nThis will add "${targetTagName}" tag to all illustrations in "${draggedTagName}"`)) {
                    return;
                }
                
                moveTag(draggedTagName, targetTagName);
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add("button-container");
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.top = '5px';
            buttonContainer.style.right = '5px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '5px'; // Space between buttons
            buttonContainer.style.display = 'none';  // Initially hidden
            tagTile.appendChild(buttonContainer);

            // Create a delete button for each tile
            const deleteButton = document.createElement('button');
            deleteButton.innerText = '🗑';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.cursor = 'pointer';

            // Add click event for delete button
            deleteButton.addEventListener('click', async (e) => {
                e.stopPropagation(); // Prevent triggering tile click events
                const confirmDelete = confirm(`Are you sure you want to delete the "${tag.name}" tag?`);
                if (confirmDelete) {
                    await removeTags([tag.name]);
                    alert(`Tag "${tag.name}" has been deleted.`);
                }
            });


            const copyButton = document.createElement('button');
            copyButton.innerText = '🗎';
            copyButton.style.backgroundColor = 'gray';
            copyButton.style.color = 'white';
            copyButton.style.border = 'none';
            copyButton.style.cursor = 'pointer';

            copyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(tag.name).then(() => {
                    console.log(`Copied "${tag.name}" to clipboard.`);
                }).catch((err) => {
                    console.error(`Failed to copy tag: ${err}`);
                });
            });

            // Edit button
            const editButton = document.createElement('button');
            editButton.innerText = '✏️'; // Unicode for edit icon
            editButton.style.border = 'none';
            editButton.style.background = 'yellow';
            editButton.style.color = 'white';
            editButton.style.cursor = 'pointer';

            editButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                let newTagName = prompt(`Edit tag "${tag.name}". Enter a new name:`, tag.name);
                if (!newTagName || newTagName.trim() === tag.name) return;
            
                const oldTagName = tag.name;
                newTagName = newTagName.trim();

                await renameTag(tag, newTagName);
                alert(`Tag "${oldTagName}" has been renamed to "${newTagName}".`);
            });

            const translateButton = document.createElement('button');
            translateButton.innerText = '🌐'; // Unicode globe icon for translation
            translateButton.style.border = 'none';
            translateButton.style.background = 'blue';
            translateButton.style.color = 'white';
            translateButton.style.cursor = 'pointer';

            translateButton.addEventListener('click', async (e) => {
                e.stopPropagation();

                // Fetch translation for the current tag
                const translatedTag = await getTagTranslation(tag.name);
                if (!translatedTag || translatedTag == tag.name) {
                    alert(`No translation found for tag: ${tag.name}`);
                    return;
                }

                // Confirm translation
                if (confirm(`Translate "${tag.name}" to "${translatedTag}"?`)) {
                    const oldTagName = tag.name;
                    await renameTag(tag, translatedTag);
                    alert(`Tag "${oldTagName}" has been renamed to "${translatedTag}".`);
                }
            });
    
            // Add buttons to the container
            buttonContainer.appendChild(translateButton);
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(copyButton);
            buttonContainer.appendChild(deleteButton);
    
            const tagText = document.createElement('div');
            tagTile.appendChild(tagText);

            const tagLink = document.createElement('a');
            tagLink.href = `https://www.pixiv.net/en/users/${uid}/bookmarks/artworks/${tag.name}?rest=${publicationType}`;
            tagLink.innerText = `${tag.name}`;
            tagLink.classList.add("tag-link");
            tagLink.style.textDecoration = 'none';
            tagLink.style.display = 'block';
            tagText.appendChild(tagLink);
            tagTile.tagLink = tagLink;
    
            const tagCount = document.createElement('div');
            tagCount.classList.add("tag-count");
            tagText.appendChild(tagCount);
            tagTile.tagCount = tagCount;
    
            // Create a container for illustrations (initially hidden)
            let illustContainer = document.createElement('ol');
            illustContainer.classList.add("illust-container");
            illustContainer.style.display = 'none';
            illustContainer.style.paddingTop = '5px';
            illustContainer.style.textAlign = 'left';

            tagTile.appendChild(illustContainer);
            tagTile.illustContainer = illustContainer;

            populateTagTile(tag);
    
            // Toggle illustration visibility when tile is clicked
            tagTile.addEventListener('click', () => {
                if (expandedTile && expandedTile !== tagTile) {
                    // Collapse the previously expanded tile
                    expandedTile.style.gridColumn = '';
                    expandedTile.querySelector('.illust-container').style.display = 'none';
                    expandedTile.querySelector('.button-container').style.display = 'none';
                }
                if (illustContainer.style.display === 'none') {
                    // Expand this tile
                    tagTile.style.gridColumn = '1 / -1'; // Full width in grid
                    illustContainer.style.display = 'block';
                    buttonContainer.style.display = 'block'; // Show button
                    expandedTile = tagTile;
                } else {
                    // Collapse this tile if already expanded
                    tagTile.style.gridColumn = '';
                    illustContainer.style.display = 'none';
                    buttonContainer.style.display = 'none'; // Hide button
                    expandedTile = null;
                }
            });

    
            tagContainer.appendChild(tagTile);
            totalCount += count;
        });
        const totalContainer = document.createElement('p');
        totalContainer.innerHTML = `<span>Total: ${totalCount}</span>`;
        const logButton = document.createElement('button');
        logButton.innerHTML = `Log Items`;
        logButton.style.marginRight = '5px';
        logButton.addEventListener('click', () => {
            console.log(JSON.stringify(sortedTags));
            console.log(sortedTags);
        });
        const fetchButton = document.createElement('button');
        fetchButton.innerHTML = `Fetch All`;
        fetchButton.style.marginRight = '5px';
        fetchButton.addEventListener('click', () => {
            setTimeout(summarizeAllBookmarks, 100);
        });

        const loadTranslationsButton = document.createElement('button');
        loadTranslationsButton.innerHTML = `Load Translations`;
        loadTranslationsButton.style.marginRight = '5px';

        loadTranslationsButton.addEventListener('click', async () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return;

                try {
                    const fileContent = await file.text();
                    const loadedTranslations = JSON.parse(fileContent);

                    if (typeof loadedTranslations !== 'object') {
                        alert('Invalid JSON file. Expected an object.');
                        return;
                    }

                    // Update the translations dictionary
                    Object.assign(globalObjects.translations, loadedTranslations);

                    console.log('Loaded translations:', loadedTranslations);
                    alert(`Loaded ${Object.keys(loadedTranslations).length} translations.`);
                } catch (error) {
                    console.error('Error loading translations:', error);
                    alert('Failed to load translations. Please ensure the file is valid JSON.');
                } finally {
                    document.body.removeChild(input);
                    //input.remove(); 
                }
            });

            document.body.appendChild(input);
            input.click(); 
        });

        const bulkActionDiv = document.createElement('div');
        if (fetchedAll){
            // Create UI for bulk add/remove
            bulkActionDiv.style.marginTop = '10px';
            const minCountInput = document.createElement('input');
            minCountInput.type = 'number';
            minCountInput.placeholder = 'Min bookmarks';
            minCountInput.style.width = '100px';
            minCountInput.style.marginRight = '5px';
    
            // Remove button
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.onclick = () => {
                const minBookmarks = parseInt(minCountInput.value, 10);
                if (isNaN(minBookmarks)) {
                    alert('Please enter a valid number for minimum bookmarks.');
                    return;
                }
                bulkRemove(minBookmarks);
            };
            

            const translateTags = async () => {
                const translations = {}; // Dictionary to store tag translations
            
                for (const tagName in tags) {
                    if (!tags[tagName].bookmarks || countIllusts(tags[tagName]) == 0){
                        continue;
                    }
                    // Skip tags that are purely alphanumeric, whitespace, or common symbols
                    if (/^[a-zA-Z0-9\s~!@#\$%\^&*\(\)\-_=\+\[\]{}\\|;:'",\.\/<>\?]+$/.test(tagName)) {
                        console.log(`Skipping tag (no translation needed): ${tagName}`);
                        continue;
                    }
                    const translation = await getTagTranslation(tagName);
                    
                    if (translation){
                        translations[tagName] = translation;
                    }
                }
            
                console.log(translations);
                console.log(JSON.stringify(translations));

                let synonyms = reverseObject(translations);
                console.log(synonyms);
                console.log(JSON.stringify(synonyms));

                if (confirm(`Save translations?`)) {
                    downloadObject(translations, "translations.json");
                }
                if (confirm(`Save translations as synonyms?`)) {
                    downloadObject(synonyms, "synonyms.json");
                }

                // Show an alert asking if the user wants to download the file
                const toTranslateCount = Object.keys(translations).length;
                let translatedCount = 0;
                if (confirm(`Are you sure to translate ${toTranslateCount} tags?`)) {
                    // Trigger the download by clicking the link
                    for (let tagName in translations) {
                        let tag = tags[tagName];
                        try{
                            await renameTag(tag, translations[tag.name]);
                            translatedCount += 1;
                        }catch(ex){
                            continue;
                        }
                    }
                }
                alert(`Translated ${translatedCount}/${toTranslateCount} tags`);
            }

            const translateButton = document.createElement('button');
            translateButton.innerHTML = `Translate Tags`;
            translateButton.style.marginRight = '5px';
            translateButton.addEventListener('click', async () => {
                await translateTags();
            });
    
            // Append elements to the bulk action div
            bulkActionDiv.appendChild(translateButton);
            bulkActionDiv.appendChild(minCountInput);
            bulkActionDiv.appendChild(removeButton);
        }

        summaryContent.appendChild(tagContainer);
        summaryContent.appendChild(totalContainer);
        summaryContent.appendChild(logButton);
        summaryContent.appendChild(fetchButton);
        summaryContent.appendChild(loadTranslationsButton);
        // Add the bulk action div to the summary UI
        summaryContent.appendChild(bulkActionDiv);
        summaryDiv.appendChild(title);
        summaryDiv.appendChild(summaryContent);
        document.body.appendChild(summaryDiv);
    }

    // Initial summary calculation when the page loads
    window.addEventListener('load', () => {
        setTimeout(async () => {
            await initializeVariables();
            renderSummary();
        }, 1000);
    });

})();
