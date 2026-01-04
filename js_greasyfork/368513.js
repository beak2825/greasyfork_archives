// ==UserScript==
// @name        SearchMore
// @namespace	novhna
// @description	Search in Bunker @ footboom.com forum
// @include     https://www.footboom.com/forum*
// @include     http://www.footboom.com/forum*
// @version     0.1.3
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/368513/SearchMore.user.js
// @updateURL https://update.greasyfork.org/scripts/368513/SearchMore.meta.js
// ==/UserScript==

// ------------------------ HELPERS ---------------------------

// TODO to balance timeout and pages count
const updatingTimeout = 24 * 60 * 60 * 1000
const pagesToGrab = 10

const headers = {
    "content-type": "application/json",
    "x-apikey": "5b0953381af1a2243f0b9b1c",
    "cache-control": "no-cache",
}

const db = (collection, method, data = null) => new Promise((resolve, reject) => {
    fetch(`https://bunker-b54a.restdb.io/rest/${collection}`, { 
        method,
        headers, 
        mode: 'cors',
        body: data && JSON.stringify(data),
    })
        .then(res => res.json())
        .then(resolve)
        .catch(console.error)
})

// formatDate :: String -> String
const formatDate = date => (new Date(date)).toLocaleDateString()

// Should be created manually in DB at first
let meta = {
    lastUpdate: 0,
    lastPage: 0,
}

let topics = []

const grabPage = page => new Promise((resolve, reject) => {
    console.log('Grab page', page)
	fetch(`https://www.footboom.com/forum/bunker?page=${page}`)
        .then(res => res.text())
        .then(doc => { 
            const rows = doc.match(/<tr> <td class="m-10">[\s\S]*?<\/tr>/g)
            const info = rows.map(row => ({
                date: row.match(/datetime="(.+?)"/)[1], 
                topic: row.match(/<a[\s\S]*?>([\s\S]+?)<\/a>/)[1].trim(),
                author: row.match(/<td[\s\S]*?>(.+?)<\/td>/g)[2].replace(/<[\s\S]+?>/g, ''),
                link: row.match(/href="(.+?)"/)[1],
                page,
            }))
            resolve(info)
        })
        .catch(console.error)
})

const updateMetadata = lastPage => {
    meta.lastPage = lastPage
    meta.lastUpdate = Date.now()
    
    db(`metadata/${meta._id}`, 'PUT', meta).then(console.log)
    
    document.querySelector('#bunker-search--last-page').textContent = meta.lastPage
}

const getAllTopics = (callback = () => console.warn('Please provide a callback!')) => 
    db('topics', 'GET').then(callback)

const updateDB = (count, offset = 0) => {
    const pages = Array(count).fill().map((_, i) => i + 1 + +offset)
    
    Promise.all(pages.map(grabPage)).then(res => {
        const topics = res.reduce(($, arr) => [...$, ...arr], [])    
        console.log('Fetched topics:', topics)
        getAllTopics(savedTopics => {
            const savedLinks = savedTopics.map(({ link }) => link)
            const topicsToSave = topics.filter(({ link }) => !savedLinks.includes(link))
            const lastPage = Math.max(...savedTopics.map(({ page }) => +page))
            console.log(lastPage)
            
            db('topics', 'POST', topicsToSave).then(res => {
                updateMetadata(lastPage)
                console.log('Topics has been updated!', res)
            })
        })
    })
}

// ------------------- INTERACTIONS ------------------------

// Fetching metadata and update the index DB every 24 hours
const fetchMetadata = () => db('metadata', 'GET').then(docs => {
    meta = docs[0]
    document.querySelector('#bunker-search--last-page').textContent = meta.lastPage
    console.warn('Should update DB:', !(Date.now() - meta.lastUpdate < updatingTimeout))
    if (Date.now() - meta.lastUpdate < updatingTimeout) return false
    
    console.log('Updating topics in Database!')
    // Shallow indexing
    updateDB(pagesToGrab) 
})

// Indexing pages in range [startPage, endPage]
const indexInRange = (startPage, endPage) => {
    console.log('start:',endPage - startPage + 1,'offset:', startPage - 1)
    updateDB(endPage - startPage + 1, startPage - 1)
}

const searchFor = word => new Promise((resolve, reject) => {
    fetch(`https://bunker-b54a.restdb.io/rest/topics?q={"_tags":{"$regex":"${word}"}}`, {
        method: 'GET',
        mode: 'cors',
        headers,
    })
        .then(res => res.json())
        .then(resolve)
        .catch(console.error)

}) 

// ============Check if need to update DB ==================

fetchMetadata()
    
// ====================== VIEW =============================

// ======================= style ===========================

const style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = `
    #bunker-search { 
        position:fixed; 
        left:0; 
        bottom:0; 
        right:0; 
        top: 0; 
        background-color: rgba(100,100,100,0.5); 
        color: black;
        z-index: -1;
        text-align: center;
        opacity: 0;
        
        transition: opacity 1s, z-index 0s 1s;
    }
    #bunker-search.expanded {
        opacity: 1;
        z-index: 9999;
        
        transition: opacity 1s, z-index 1s;
    }
    #bunker-search hr {
        border-top: 1px solid #fff;
    }

    #bunker-search--panel {
        display: inline-block;
        height: 100vh;
        width: 100vw;
        max-width: 700px;
        padding: 30px;
        background-color: #eee;
        transform: scale(0);

        transition: 1s;
    }
    .expanded #bunker-search--panel {
        transform: scale(1);
    }

    #bunker-search--results {
        overflow-y: auto; 
        overflow-x: hidden;
        text-align: left;
    }

    #bunker-search-control {
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: green; 
        color: white;
        z-index: 99999;
        cursor: pointer;
    }
    #bunker-search-control .glass-image {
        height: 40px; 
        width: 40px; 
        background: url(https://www.footboom.net/img/new-images/icons/x2/searchx2.png) no-repeat center center;
        background-size: 17px 17px;
    }

    pre#bunker-search--last-page {
        display: inline;
    }

    .bunker-search--info {
        text-align: center;
    }

`
document.querySelector('head').appendChild(style);

// ================== results view =========================

const view = document.createElement('div')
view.id = 'bunker-search'

const submitForm = e => {
    e.preventDefault()

    view.querySelector('#bunker-search--results').innerHTML = `<li class="bunker-search--info">Шукаємо ${e.target.query.value}...</li>` 
    searchFor(e.target.query.value)
        .then(res => {
            const links = res.map(({ link, topic, author, date }) => `
                <li>[${formatDate(date)}] <a href="${link}">${topic}</a> <b>${author}</b></li>
            `).join('')
            view.querySelector('#bunker-search--results').innerHTML = links || '<li class="bunker-search--info">Нічого не знайдено</li>'
        })
}

const toggleSearchPanel = e => {
    view.classList[view.classList.contains('expanded') ? 'remove' : 'add']('expanded')
}

view.innerHTML = `
    <div id="bunker-search--panel">
        <form id="bunker-search--search">
            <input name="query" />
            <button>Шукати в Бункері</button>
        </form>
        <ul id="bunker-search--results"></ul>
        <hr />
        <div>
            Всього проіндексовано <pre id="bunker-search--last-page">...</pre> стор.<br />
            <form id="bunker-search--indexing">
                Індексувати з <input name="start" type="number" min="1" value="1" /> по <input name="end" type="number" min="1" value="1" /> стор. <button>Вперед</button>
            </form>
        </div>
    </div>
`
document.body.appendChild(view)
view.querySelector('form#bunker-search--search').onsubmit = submitForm
// Deep indexing
view.querySelector('form#bunker-search--indexing').onsubmit = e => {
    e.preventDefault()
    indexInRange(e.target.start.value, e.target.end.value)
}

// ==================== control ==========================

const control = document.createElement('div')
control.id = 'bunker-search-control'

control.onclick = toggleSearchPanel;
control.title = 'Search Bunker'
control.innerHTML = `<div class="glass-image"></div>`
document.body.appendChild(control)

