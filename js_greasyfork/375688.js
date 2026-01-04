// ==UserScript==
// @name         anime-sharing 看图搜游戏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I am not trying to take over the world.
// @author       You
// @match        http://www.anime-sharing.com/forum/hentai-games-38/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375688/anime-sharing%20%E7%9C%8B%E5%9B%BE%E6%90%9C%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/375688/anime-sharing%20%E7%9C%8B%E5%9B%BE%E6%90%9C%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

(function() {
    let posts = [...document.querySelectorAll('.rating0')]
    let db = new Storage('collection_list')
    let collectionList = db.fetch()
    let waterfallId = {}

    createWaterfall()
    flowWaterfall(posts)
    createNavItem('同人', filterDoujin)
    createNavItem('工口', filterEro)
    createNavItem('全部', filterAll)

    modifyElement()
    createCollectionBoard()

    // 创建拖拽区
    function createCollectionBoard() {
        createCollectionDOM()
        bindCollectionEvents()
    }

    // 移除元素
    function modifyElement() {
        $(sidebar).hide()
        $('.threadbit').hide()
        $('#yui-gen6').css({'width': '600px'})
    }

    // 创建拖拽区实体
    function createCollectionDOM() {
        let div = document.createElement('div')
        div.id = div.className = 'collectionBoard'
        for(let i=0; i<collectionList.length; i ++) {
            let hash = collectionList[i]
            let a = document.createElement('a')
            a.target = '_blank'
            a.href = hash.href
            a.title = hash.innerHTML
            a.innerHTML = hash.innerHTML
            div.appendChild(a)
        }
        document.body.appendChild(div)

        let style = document.createElement('style')
        style.innerHTML = `
            .collectionBoard {
              transition: all .4s;
              width: 0px;
              height: 0px;
              position: fixed;
              top: 100px;
              left: ${document.documentElement.clientWidth -300}px;
              border: 4px solid skyblue;
              border-left: none;
              border-right: none;
              background: #fff;
              overflow: auto
            }
            .collectionBoard::-webkit-scrollbar {
                width: 0;
            }
            .collectionBoard a {
              display: block;
              width: 200px;
              text-decoration: none;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              box-sizing: border-box;
              line-height: 40px;
              color: #000;
              background: #fff;
              text-align: center;
            }
            .collectionBoard a:hover {
              color: #fff;
              background: #0e88eb;
              text-decoration: none;
              box-shadow: 0 0 2px 2px white;
            }
            .active1 {
              width: 200px;
            }
            .active2 {
              height: 300px;
            }
        `
        document.head.appendChild(style)
    }

    // 绑定拖拽区事件
    function bindCollectionEvents() {
        let dragged

        document.addEventListener('dragstart', e => {
            dragged = e.target
            e.target.style.opacity = '.5'
        })
        document.addEventListener('dragend', e => {
            e.target.style.opacity = ''
        })
        document.addEventListener('dragenter', e => {
            if(e.target === collectionBoard || e.target.parentNode === collectionBoard) {
                collectionBoard.style.backgroundColor = '#ddd'
            }
        })
        document.addEventListener('dragleave', e => {
            if(e.target === collectionBoard || e.target.parentNode === collectionBoard) {
                collectionBoard.style.backgroundColor = ''
            }
        })
        document.addEventListener('dragover', e => {
            e.preventDefault()
        })
        document.addEventListener('drop', e => {
            e.preventDefault()
            if(e.target === collectionBoard || e.target.parentNode === collectionBoard) {
                let a = document.createElement('a')
                a.target = '_blank'
                a.href = dragged.parentNode.href
                a.title = dragged.title
                a.innerHTML = dragged.title

                let hash = {href: a.href, innerHTML: a.innerHTML}
                if(collectionList.every(collection => collection.href !== hash.href)) {
                    collectionList.push(hash)
                    db.save(collectionList)
                    collectionBoard.appendChild(a)
                    a.oncontextmenu = deleteRecord
                }
            }
        })

        document.addEventListener('scroll', e => {
            let $div = $(collectionBoard)
            if(document.documentElement.scrollTop >= waterfall.offsetTop - 100) {
                $div.css({'opacity': '1'})
                $div.addClass('active1')
                setTimeout(() => $div.addClass('active2'), 400)
            } else {
                $div.css({'opacity': '0'})
            }
        })

        let els = collectionBoard.querySelectorAll('a')
        for(let i=0; i<els.length; i++) {
            els[i].oncontextmenu = deleteRecord
        }
    }

    // 记录删除
    function deleteRecord(e) {
        let href = e.target.href
        let data = collectionList.filter(collection => collection.href === href)
        if(data) {
            console.log('删除记录')
            db.remove(data)
            e.target.remove()
        }
        return false
    }

    // localStorage 对象
    function Storage(key) {
        this.key = key
        this.fetch = function() {
            return JSON.parse(localStorage.getItem(this.key) || '[]')
        }
        this.save = function(data) {
            localStorage.setItem(this.key, JSON.stringify(data))
        }
        this.value = this.fetch()
        this.remove = function(data) {
            this.save(this.value.splice(this.value.indexOf(data), 1))
        }
    }

    // 创建导航项
    function createNavItem(navName, event) {
        let li = document.createElement('li')
        li.innerHTML = ` <a class="navtab" href="javascript:;">${navName}</a> `
        li.id = `vbtab_${navName}`
        navtabs.appendChild(li)
        $(li).bind('click', e => $(e.currentTarget).addClass('selected').siblings('.selected').removeClass('selected'))
        $(li).bind('click', event)
    }

    // 创建瀑布流
    function createWaterfall() {
        let waterfall = document.createElement('div')
        waterfall.id = waterfall.className = 'waterfall'
        waterfall.innerHTML = `<ul id='leftStream'></ul><ul id='rightStream'></ul>`
        threads.prepend(waterfall)

        let style = document.createElement('style')
        style.innerHTML = `ul {list-style: none;}.waterfall {display: flex; align-items: flex-start;}.waterfall >ul {display: block; width: 50%;}.waterfall >ul >li {padding: 5px;}.waterfall >ul >li img{width: 100%; box-shadow: 5px 5px 4px 2px rgba(167, 167, 167, .7);}`
        document.head.appendChild(style)
    }

    // 加载瀑布流
    function flowWaterfall(posts) {
        let seed = Math.random() * 10000
        waterfallId = {}
        waterfallId[seed] = true
        posts.map(post => {
            let tempImg = document.createElement('img')
            tempImg.src = post.querySelector('img').src
            tempImg.onload = () => {
                if(!waterfallId[seed]) return

                let src = post.querySelector('img').src
                let href = post.querySelector('.title').href
                let title = post.querySelector('.title').innerText
                let img = document.createElement('img')
                let a = document.createElement('a')
                let li = document.createElement('li')

                img.src = src
                img.title = title
                a.href = href
                a.target = '_blank'

                a.appendChild(img)
                li.appendChild(a)

                let targetStream = minHeight(leftStream, rightStream)
                targetStream.appendChild(li)
            }
        })
    }

    // 清空瀑布流
    function clearWaterfall() {
        leftStream.innerHTML = ''
        rightStream.innerHTML = ''
    }

    // 过滤同人
    function filterDoujin() {
        filterItem('同人ゲーム')
    }

    // 过滤工口
    function filterEro() {
        filterItem('エロゲーム')
    }

    // 过滤失效
    function filterAll() {
        filterItem('')
    }

    // 图片过滤器
    function filterItem(requirement) {
        posts = [...document.querySelectorAll('.rating0')]
        posts = posts.filter(post => post.querySelector('.title').innerText.indexOf(requirement) !== -1)
        clearWaterfall()
        flowWaterfall(posts)
    }

    // 工具函数
    function minHeight(a, b) {
        return a.clientHeight <= b.clientHeight? a: b
    }
})()