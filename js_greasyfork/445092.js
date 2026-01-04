// ==UserScript==
// @name         脉脉助手
// @description  连结潜在客户
// @namespace    43.154.7.161
// @version      1.0.5
// @author       Saihhold Chiu
// @match        https://maimai.cn/web/search_center?type=contact&query=*
// @match        https://www.qcc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maimai.cn
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      43.154.7.161
// @connect      127.0.0.1
// @connect      qcc.com
// @downloadURL https://update.greasyfork.org/scripts/445092/%E8%84%89%E8%84%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/445092/%E8%84%89%E8%84%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//每500毫秒自动检查，当联系人列表加载后运行start()函数。
let isLoaded = setInterval(function () {
    if (document.getElementsByClassName('contact-card').length != 0) {
        start() //主代码块
        login() //服务器通信
        checkCollections() //检查收藏
        clearInterval(isLoaded)
    }
}, 500)

function checkCollections() {
    GM_xmlhttpRequest({
        method: 'POST',
        url: eleObj.flaskUrl + '/check_collections',
        data: JSON.stringify(eleObj.data),
        onload: function (response) {
            var res = JSON.parse(response.responseText)
            for (var i = 0; i < eleObj.contactList.childElementCount; i++) {//逐个检查姓名和职位匹配
                if (eleObj.contactList.children[i].querySelector('.flex-1') !== null) { //1.存在这个class：非好友，无加好友按键
                    var thisName = eleObj.contactList.children[i].querySelector('.sc-fAjcbJ.JJSTU').innerHTML.split('<span', 2)[0]
                    var thisJob = eleObj.contactList.children[i].querySelectorAll('div')[7].innerHTML.split('<img', 2)[0]
                } else {
                    var thisName = eleObj.contactList.children[i].querySelectorAll('.media-body')[0].children[0].children[0].innerHTML.split('<span', 2)[0]
                    var thisJob = eleObj.contactList.children[i].querySelectorAll('div')[6].innerHTML.split('<img', 2)[0]
                }
                for (let c = 0; c < res.collections.length; c++) {
                    if (res.collections[c].name == thisName && res.collections[c].job == thisJob) { //发现名字和job一致
                        eleObj.collectButtonAll[i].innerHTML = '取消收藏'
                        eleObj.collectButtonAll[i].className = 'btn btn-warning'
                        break
                    } else { //没有发现一致
                        eleObj.collectButtonAll[i].innerHTML = '收藏'
                        eleObj.collectButtonAll[i].className = 'btn btn-primary'
                    }
                }//end for
                if (res.collections.length == 0) {//对于上面一个循环的补充，当flask返回的collections的长度为0的时候（取消最后一个收藏）由于0不小于0，所以不会将按钮改动，所以必须加入对于这种情况的特殊处理。
                    eleObj.collectButtonAll[i].innerHTML = '收藏'
                    eleObj.collectButtonAll[i].className = 'btn btn-primary'
                }//end if

            }//end for
        }//end onload func
    })//end GM
}//end func

function login() {
    GM_xmlhttpRequest({
        method: 'POST',
        url: eleObj.flaskUrl + '/login',
        data: JSON.stringify(eleObj.data),
        onload: function (response) {
            res = JSON.parse(response.responseText)
            if (res.res == 'True') {
                console.log('user already exist')
            } else {
                console.log('new user')
            }//end if else
        }//end onload
    })//end GM
}//end function
//让侧边栏可操作


function start() {
    //静态元素
    window.eleObj = {
        head: document.querySelector('head'),
        rightBar: document.querySelector('.v6-rightBar'),
        websiteInfoBar: document.querySelector('.website-info'),
        searchInput: document.querySelector('.webimSearchInput'),
        contactList: document.querySelector('.list-group'),
        //下面是之后要添加进来的元素
        qccCard: '',
        mailSearchCard: '',
        mailSearchCardImg: '',
        mailSearchCardName: '',//邮箱搜索-名字输入框
        mailSearchCardDomain: '',//邮箱搜索-
        mailSearchCardResult: '',//搜索结果
        thisCompanyName: '',//企查查请求到的公司名
        kanbanCard: '',
        selectButtonAll: document.getElementsByName('media-right-select-button'), //所有选中按钮
        collectButtonAll: document.getElementsByName('media-right-collect-button'),//所有收藏按钮

        //后端相关
        flaskUrl: 'http://43.154.7.161:9000',
        //收藏数据
        collections: [],
        //发送对象
        data: {
            user: share_data.data.mycard.name,
            uid: share_data.data.mycard.id,
            company: share_data.data.mycard.company,
        }
    }//end eleObj


    function changeWebsiteInfoBarCss() { //让侧边栏变为可操作
        eleObj.websiteInfoBar.style.pointerEvents = 'auto'
    } changeWebsiteInfoBarCss()

    //引入bootstrap css
    function introBootStrapCss() {
        let cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.1/css/bootstrap.min.css'
        eleObj.head.appendChild(cssLink)
    } introBootStrapCss()

    //添加监听，ajax刷新时运行addButtonsToMediaRight函数
    let observe = new MutationObserver(function mutations() {
        function clearExsitingButtons() { //ajax加载先删除原本的所有按钮
            let exsitintButtonList = document.querySelectorAll('[name = "media-right-select-button"],[name = "media-right-collect-button"]')
            for (let i = 0; i < exsitintButtonList.length; i++) {
                exsitintButtonList[i].remove()
            }//end for
        } clearExsitingButtons()
        addButtonsToMediaRight()
        onclickEvents()
        checkCollections()
    })//end func
    observe.observe(eleObj.contactList, { childList: true })

    //添加按钮（收藏/选中）
    function addButtonsToMediaRight() {
        for (let i = 0; i < eleObj.contactList.childElementCount; i++) {
            var buttonsDiv = document.createElement('div')
            buttonsDiv.style = 'text-align:center'
            buttonsDiv.innerHTML = `
            <button name="media-right-select-button" class="btn btn-primary" style="width: 64px; height: 28px; margin-top: 5px;">选中</button>
            <button name="media-right-collect-button" class="btn btn-primary" style="width: 64px; height: 28px; margin-top: 5px;">收藏</button>`

            eleObj.contactList.children[i].children[0].appendChild(buttonsDiv)
        }//end for
    } addButtonsToMediaRight()

    //在侧边栏建立三张卡片
    //建立企查查/搜索邮箱/看板卡片
    function addCardsToSideBar() {
        eleObj.websiteInfoBar.innerHTML = `
    <div class="card text-center" style="width:100%;margin-bottom:5px" name="qcc-card";>
    <div class="card-body"">
        <h5 class="card-title">企查查</h5>
        <p class="card-text"></p>
        <p class="card-text"></p>
        <button type="button" class="btn btn-primary">打开企查查</button>
        <div class="alert alert-danger" role="alert" style="display:none">
        企查查未能正确请求数据，请打开企查查并登录。
        </div>
    </div>
    </div>

    <div class="card text-center" style="width:100%;margin-bottom:5px" name="mail-search-card";>
    <div class="card-body"">
        <h5 class="card-title">搜索邮箱</h5>
        <img style="width:50px;height:50px;border-radius:100%;margin-bottom:5px;display:none" name="mail-search-card-img"> </img>
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="姓名" aria-label="Username" name="mail-search-card-name">
            <span class="input-group-text">@</span>
            <input type="text" class="form-control" placeholder="域名" aria-label="Server" name="mail-search-card-domain">
        </div>
        <button type="button" class="btn btn-primary">搜索邮箱</button>
        <div class="alert alert-success" role="alert" style="display:none">
            该域名为有效域名。
        </div>
        <div class="alert alert-danger" role="alert" style="display:none">
            该域名无效，请确认该公司邮箱域名。
        </div>
        <div class="alert alert-warning" role="alert" style="display:none">
            没有从服务器得到结果，可能由以下原因导致：<br>
            1.该联系人已离职，邮箱被注销。<br>
            2.对方服务器拒绝提供邮箱验证。<br>
            3.对方的邮箱为特殊格式。<br>
            不过您仍然可以尝试发送邮件到以下邮箱：<br>
        </div>
        <ul class="list-group" style="max-height:200px;overflow:scroll" name="mail-search-card-result">
        </ul>
    </div>
    </div>

    <div class="card text-center" style="width:100%;margin-bottom:5px" name="kanban-card";>
    <div class="card-body"">
        <h5 class="card-title">看板</h5>
        <button type="button" class="btn btn-primary">打开看板</button>    </div>
    </div>
    `
        //存入eleObj
        eleObj.qccCard = document.querySelector('[name="qcc-card"]')
        eleObj.mailSearchCard = document.querySelector('[name="mail-search-card"]')
        eleObj.mailSearchCardImg = document.querySelector('[name="mail-search-card-img"]')
        eleObj.mailSearchCardName = document.querySelector('[name="mail-search-card-name"]')
        eleObj.mailSearchCardDomain = document.querySelector('[name="mail-search-card-domain"]')
        eleObj.mailSearchCardResult = document.querySelector('[name="mail-search-card-result"]')
        eleObj.kanbanCard = document.querySelector('[name="kanban-card"]')
    } addCardsToSideBar()

    //运行时请求企查查（自调用）
    function requestQcc() {
        GM_xmlhttpRequest({
            methods: 'GET',
            url: 'https://www.qcc.com/web/search?key=' + eleObj.searchInput.value,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },//end headers
            onload: function (response) {
                let res = document.createElement('div')
                res.innerHTML = response.responseText
                try { //尝试提取公司名和域名
                    let companyName = res.getElementsByClassName('title copy-value')[0].children[0].innerHTML
                    let companyDomain = res.getElementsByClassName('rline over-rline')[1].children[1].children[0].innerHTML.split('@', 2)[1].replaceAll('<em>', '').replaceAll('</em>', '')
                    eleObj.qccCard.children[0].children[1].innerHTML = companyName
                    eleObj.qccCard.children[0].children[2].innerHTML = companyDomain

                    eleObj.thisCompanyName = companyName//存入eleObj
                    eleObj.mailSearchCardDomain.value = companyDomain //将提取到的数据填入mailsearchdomain输入栏
                } catch (e) { //若未能成功显示错误弹窗
                    eleObj.qccCard.querySelector('.alert.alert-danger').style.display = ''
                }//end try catch

            }//end onload func
        })//end GMxlr
    } requestQcc()

    function onclickEvents() {
        function removePreSearchRes() {
            while (eleObj.mailSearchCardResult.childElementCount > 0) { //清空上一次请求到的邮箱
                eleObj.mailSearchCardResult.children[0].remove()
            }//end while
            eleObj.mailSearchCard.querySelector('.alert.alert-success').style.display = 'none'
            eleObj.mailSearchCard.querySelector('.alert.alert-danger').style.display = 'none' //隐藏成功或错误提示
            eleObj.mailSearchCard.querySelector('.alert.alert-warning').style.display = 'none'
        }
        for (let i = 0; i < eleObj.contactList.childElementCount; i++) {//选中按钮 收藏按钮
            if (eleObj.contactList.children[i].querySelector('.flex-1') !== null) { //1.存在这个class：非好友，无加好友按键
                eleObj.selectButtonAll[i].onclick = function () {
                    eleObj.mailSearchCardName.value = this.parentElement.parentElement.parentElement.querySelector('.sc-fAjcbJ.JJSTU').innerHTML
                    eleObj.mailSearchCardImg.src = this.parentElement.parentElement.parentElement.querySelector('._1aIy2xc3xN-j_7MeIWMu-Q').children[0].src
                    eleObj.mailSearchCardImg.style.display = ''
                    removePreSearchRes()
                }//end onclick function
            } else {//其他两种：2.好友/3.非好友且有加好友按键
                eleObj.selectButtonAll[i].onclick = function () {
                    eleObj.mailSearchCardName.value = this.parentElement.parentElement.querySelectorAll('.media-body')[0].children[0].children[0].innerHTML.split('<span', 2)[0]
                    eleObj.mailSearchCardImg.src = this.parentElement.parentElement.querySelector('span.cursor-pointer').children[0].src
                    eleObj.mailSearchCardImg.style.display = ''
                    removePreSearchRes()
                }//end onclick function
            }//end if else
        }

        for (let i = 0; i < eleObj.contactList.childElementCount; i++) {//收藏和取消收藏按钮
            eleObj.collectButtonAll[i].onclick = function () {
                if (eleObj.contactList.children[i].querySelector('.flex-1') !== null) {
                    var thisData = eleObj.data
                    thisData.collectionName = this.parentElement.parentElement.parentElement.querySelector('.sc-fAjcbJ.JJSTU').innerHTML //姓名
                    thisData.collectionJob = this.parentElement.parentElement.querySelectorAll('div')[6].innerHTML.split('<img', 2)[0] //职位 可能存在<img标签，舍弃
                    thisData.collectionImgSrc = this.parentElement.parentElement.parentElement.querySelector('._1aIy2xc3xN-j_7MeIWMu-Q').children[0].src
                } else {
                    var thisData = eleObj.data
                    thisData.collectionName = this.parentElement.parentElement.querySelectorAll('.media-body')[0].children[0].children[0].innerHTML.split('<span', 2)[0]
                    thisData.collectionJob = this.parentElement.parentElement.querySelector('div.text-muted.font-12').innerHTML.split('<img', 2)[0]
                    thisData.collectionImgSrc = this.parentElement.parentElement.querySelector('span.cursor-pointer').children[0].src
                }//end if else
                if (this.innerHTML == '收藏') {
                    var thisReqUrl = eleObj.flaskUrl + '/save_collection'
                } else if (this.innerHTML == '取消收藏') {
                    var thisReqUrl = eleObj.flaskUrl + '/cancle_collection'
                }//end if else
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: thisReqUrl,
                    data: JSON.stringify(thisData),
                    onload: function (response) {
                        if (response.responseText) {
                            checkCollections()
                        }
                    }//onload func
                })//end GM
            }//end onclick func
        }//end for

        eleObj.qccCard.querySelector('button').onclick = function () { //打开企查查按钮
            window.open('https://www.qcc.com/web/search?key=' + eleObj.thisCompanyName)
        }

        eleObj.mailSearchCard.querySelector('button').onclick = function () {//搜索邮箱按钮
            removePreSearchRes()
            var thisData = eleObj.data //新建thisdata，继承data内容
            thisData.name = eleObj.mailSearchCardName.value
            thisData.domain = eleObj.mailSearchCardDomain.value
            thisData.query = eleObj.searchInput.value
            this.innerHTML = `
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden"></span>
            </div>
            `
            this.disabled = 'disabled' //搜索邮箱按钮禁用
            for (let i = 0; i < eleObj.contactList.childElementCount; i++) {
                eleObj.selectButtonAll[i].disabled = 'disabled' //选中按钮禁用
            }
            GM_xmlhttpRequest({
                method: 'POST',
                url: eleObj.flaskUrl + '/get_emails',
                data: JSON.stringify(thisData),
                onload: function (response) {
                    eleObj.mailSearchCard.querySelector('button').innerHTML = '搜索邮箱'
                    eleObj.mailSearchCard.querySelector('button').disabled = ''
                    for (let i = 0; i < eleObj.contactList.childElementCount; i++) {
                        eleObj.selectButtonAll[i].disabled = '' //选中按钮禁用
                    }
                    let res = JSON.parse(response.responseText)
                    console.log(res)
                    if (res.check_mx_res == 'True') {//如果有mx记录
                        eleObj.mailSearchCard.querySelector('.alert.alert-success').style.display = ''
                        if (res.any_real_email == 'True')
                            for (let i = 0; i < res.smtp_ok_list.length; i++) { //将请求到的结果循环写入页面
                                let mailRes = document.createElement('li')
                                mailRes.className = 'list-group-item'
                                mailRes.innerHTML = res.smtp_ok_list[i]
                                eleObj.mailSearchCardResult.appendChild(mailRes)
                            }
                        if (res.any_real_email == 'False') { //若有mx但验证的邮箱为空时
                            eleObj.mailSearchCard.querySelector('.alert.alert-warning').style.display = ''
                            let mailRes = document.createElement('li')
                            mailRes.className = 'list-group-item'
                            mailRes.innerHTML = res.smtp_ok_list
                            eleObj.mailSearchCardResult.appendChild(mailRes)
                        }//end if in if
                    } else {
                        eleObj.mailSearchCard.querySelector('.alert.alert-danger').style.display = ''
                    }//end if else

                }//end onload func
            })//end GM
        }//end this onclick func

        eleObj.kanbanCard.querySelector('button').onclick = function () {
            GM_xmlhttpRequest({
                method: 'POST',
                data: JSON.stringify(eleObj.data),
                url: eleObj.flaskUrl + '/open_kanban',
                onload: function (response) {
                    window.open(eleObj.flaskUrl + response.responseText)
                }
            })//end GM
        }//end onclick func
    } onclickEvents()



}//end start func