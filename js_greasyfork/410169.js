// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Forum category indexer
// @description  Creates an index from a forum category
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/forum/*
// @match        https://www.7cups.com/home/*
// @noframes
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @grant        none
// @version      1
// @downloadURL https://update.greasyfork.org/scripts/410169/7%20Cups%20-%20Forum%20category%20indexer.user.js
// @updateURL https://update.greasyfork.org/scripts/410169/7%20Cups%20-%20Forum%20category%20indexer.meta.js
// ==/UserScript==
(() => {
    let whereami = location.pathname.split('/').filter(x => x.length)
    if (whereami.length != 2) return
    if (whereami[1].includes('.php')) return

    let id = ''
    if (whereami[0] == 'forum') {
        id = whereami[1].split('_')[1]
        }
    else {
        id = $('[data-community]').first().attr('data-community')
        }
    if (id == '') return
    let catname = document.title.replace(/\s*-\s7\s?Cups$/, '')

    $('body').prepend(
        '<button id="rc-ixbutton" style="position: absolute; top: 120px; left: 20px; padding: 4px 8px; color: #fff; background: #4c4; border: 1px solid #3b3; border-radius: 4px; cursor: pointer;" '
        + 'title="Build an index file for this forum category (' + id + ')">Build index</button>'
        + '<progress id="rc-ixprogress" hidden style="width: 400px; height: 1em; position: absolute; top: 160px; left: 20px;" value="0" max"1"></progress>'
        + '<a id="rc-ixdownload" hidden style="position: absolute; top: 184px; left: 20px;" href="#"><i class="fa fa-download" style="color: #00f; font-size: 200%; text-shadow: 0 0 4px #fff;" '
        + 'title="Download the index file"></i></a>')

    let save = async function (obj) {
        var url = URL.createObjectURL(new Blob([LZString.compressToEncodedURIComponent(JSON.stringify(obj))]), 'application/octet-stream'),
            prog = $('#rc-ixprogress')
        prog[0].max = prog[0].value
        $('#rc-ixdownload')
            .attr('href', url)
            .attr('download', 'acf' + id + '.jslz')
            .prop('hidden', false)
        }

    let build = async function (catid, author, corpus, forum) {
        var prog = $('#rc-ixprogress'), n = 0
        prog.prop('hidden', false)
        var what = {req: 'threadlist', commID: catid, sort: 'New', limit: 100, p: 1}
        while (true) {
            if (what.p > 1) await new Promise(i => setTimeout(i, 2000 + Math.round(600 * Math.random())))
            let data = await $.get('/home/subcommunity.php', what)
            if (what.p == 1) prog[0].max = data.numThreads + 40
            prog[0].value += 100
            if (data.threads.length == 0) break
            for (let t of data.threads) {
                if (!forum[t.forumID]) forum[t.forumID] = t.forumTitle
                if (!author[t.creatorID]) author[t.creatorID] = t.init_screenName + ',' + t.init_imgURL.split('/').reverse()[0].replace('.jpg', '')
                corpus[t.threadID] = {
                    id: t.threadID,
                    cat: t.catID,
                    forum: t.forumID,
                    by: t.creatorID,
                    at: t.initialPostTime,
                    up: t.postsVotedUp,
                    body: t.threadLead.replace(/<[^>]+>/ig, ' ').replace(/\s+/g, ' ').replace(/^\s/, '').replace(/@\w+/g, ''),
                    head: t.threadTitle.trim()
                    }
                ;++n
                }
            ++what.p // next page
            //if (what.p == 5) break // <<<<<<<<<<<<<<<<< TESTING
            }
        return n
        }

    $('#rc-ixbutton').on('click', async function () {
        var author = {}, // authors by id
            corpus = {}, // all threads by id
            forum = {} // forums by id
        var n = await build(id, author, corpus, forum)
        await save({id: id, cat: catname, on: Date.now(), author: author, corpus: corpus, forum: forum, threads: n})
        })

    })()