// ==UserScript==
// @name         BBS Plus
// @version      1.3.0
// @description  Tools for BBS Network
// @author       gviuygyiug78g98g9h
// @match        https://bbs.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bbs.market
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.12/push.min.js
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @license      MIT
// @namespace    https://greasyfork.org/users/893424
// @downloadURL https://update.greasyfork.org/scripts/442153/BBS%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/442153/BBS%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('head').append($(`
  <!-- CSS部分 -->
  <style>
  .css-1kaoat8 {
    position: absolute;
    min-width: 100%;
    transition: all 150ms ease 0s;
    overflow: hidden;
    z-index: 10;
    border-radius: 8px;
    visibility: visible;
    opacity: 1;
    pointer-events: all;
    right: 0px;
    top: 100%;
}
.select-none{
	user-select: none;
    }
  </style>`));
    function removeElement(arr,val) {
        var index = arr.indexOf(val);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr
};
    let tokenName
    let showblockUserList=false
    let flag=false
    let link
    let ico = document.getElementsByTagName('link')
    let aList = document.getElementsByTagName('a')
    let logo
    let keyword
    function addBlockUser(username){
        let userArray=JSON.parse(localStorage.getItem('blockUsers'))||[]
        if(userArray.indexOf(username)==-1){
            userArray.push(username)
        }
        localStorage.setItem('blockUsers',JSON.stringify(userArray))
        buildBlockList()
    }
    function removeBlockUser(username){
        let userArray=JSON.parse(localStorage.getItem('blockUsers'))||[]
        userArray=removeElement(userArray,username)
        localStorage.setItem('blockUsers',JSON.stringify(userArray))
        showblockUserList=false
        showBlockUserList()
        buildBlockList()
    }
    setTimeout(() => {
        setTimeout(()=>{
            //$('#modal-root').attr('translate',"no")
            buildBlockList()
        }, 2000);
        for (let index = 0; index < ico.length; index++) {
            const element = ico[index];
            console.log(element)
            if(element.rel=='shortcut icon'){
                link=element
                break
            }
        }
        window.setInterval(function(){
            if($("#blockList-btn").length==0){
                buildBlockList()
            }
            $('body').attr("translate","no")
            tokenName=location.href.split('/')[3]
            let spans=$('span')
            if(spans.length>0){
                for (let index = 0; index < spans.length; index++) {
                    const element = spans[index];
                    if(element.dir=='auto'){
                        element.id='autoSpan'+index
                        $('#autoSpan'+index).attr('translate',"yes")
                    }
                    if(element.innerText.indexOf('Posted by')>-1){
                        if(element.childNodes[0].childNodes[1]){
                            let postCard=element.parentNode.parentNode.parentNode.parentNode.parentNode
                            if(JSON.parse(localStorage.getItem('blockUsers').indexOf(element.childNodes[0].childNodes[1].innerText))>-1){
                                element.parentNode.parentNode.parentNode.parentNode.parentNode.id='hidden'+index
                                let card = document.getElementById('hidden'+index)
                                card.remove()
                            }else{
                                try{
                                    if(postCard.childNodes[2].childNodes[0].childNodes.length>5){
                                        continue
                                    }
                                    //console.log(postCard.children[2].children[0])
                                    let icon=`<div id="hide-btn-${index}" data-test="ShareButton" class="relative cursor-pointer undefined css-1u8qly9"><div data-test="button" class="transition relative flex items-center justify-center leading-none cursor-pointer shadow-s1 dark:shadow-s5 bg-gray-50 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-200 text-gray-500 css-9l7byh"><span data-test="icon" class="cursor-pointer transition flex justify-center items-center  css-hma173"><svg xmlns="http://www.w3.org/2000/svg" class=" css-1tg8k9x" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg></span></div></div>`
                                    setTimeout(()=>{
                                        postCard.children[2].children[0].children[4].id='share-btn-'+index
                                        $('#'+'share-btn-'+index).after(icon)
                                        $('#'+'hide-btn-'+index).on({click:function(e){
                                            addBlockUser(element.childNodes[0].childNodes[1].innerText)
                                        }})
                                    },1)
                                }catch(e){
                                    //console.log(postCard.children)
                                }
                            }
                        }
                    }
                    if($('#postHead').length>1){
                    }else{
                        if(element.innerText.indexOf('Post income')>-1){
                            if(element.childNodes[0].childNodes[1]){
                                let postCard=element.parentNode.parentNode.parentNode.parentNode.parentNode
                                postCard.children[0].children[0].id="postHead"
                                $('#postHead').attr('translate',"no")
                            }
                        }
                    }
                }
            }
            if(spans.length>0){
                for (let index = 0; index < spans.length; index++) {
                    const element = spans[index];
                    if(element.innerText.indexOf('Posted by')>-1){

                    }
                }
            }
            buildSearchBar()
            let e = document.getElementsByClassName('css-1xjhfh5')
            if(e.length>0){
                if(!flag){
                    flag=true
                    Push.create("New Notification", {
                        body: "You got a new notification.",
                        icon: 'https://firebasestorage.googleapis.com/v0/b/deweb-519a7.appspot.com/o/bbs.market%2Flogo.png?alt=media',
                        timeout: 10000
                    });
                }
            }else{
                flag=false
            }
            link.href=flag?'https://s2.loli.net/2022/03/27/ICerNyjUa125mfM.png':'https://firebasestorage.googleapis.com/v0/b/deweb-519a7.appspot.com/o/bbs.market%2Ffavicon.png?alt=media'
        }, 2000);
        console.log(aList.length)
        //setTimeout(()=>buildSearchBar(),5000);
    }, 3000);
    function buildSearchBar(){
        if($("#searchInput").length>0){
            return
        }
        for (let index = 0; index < aList.length; index++) {
            const element = aList[index];
            if(element.href=='https://bbs.market/?tab=myBbs'){
                element.id='logo'
                console.log(element)
                $("#logo").after("<div class=\"rounded-lg h-9 w-96 bg-gray-100 dark:bg-gray-800 leading-none flex p-2\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6 text-gray-300 mr-2 dark:text-gray-600\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\"></path></svg><input id=\"searchInput\" class=\"bg-gray-100 dark:bg-gray-800\" placeholder=\"Search BBS\"></div>")
                $("#searchInput").on({input:function(e){
                    console.log(e)
                    keyword = e.currentTarget.value
                    console.log(keyword)
                },keydown:function(e){
                    if (e.key == 'Enter' && keyword) {
                        let url = changeURLArg('https://bbs-search.vercel.app', 'keyword', keyword)
                        window.location.href = url
                        console.log(window.location.href)
                    }
                }})
                break
            }
        }
    }
    function buildBlockList(){
        if($("#blockList-btn").length>0){
            document.getElementById('efioewj').remove()
        }
        let users=JSON.parse((localStorage.getItem('blockUsers')||'[]'))
        let listHtml
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            let html=`<div class=\"transition flex items-center px-4 h-[42px]  \"><div class=\"flex items-center flex-1 mr-1 \"><img data-test=\"circular-image \" class=\"transition transition bg-gray-50 dark:bg-gray-800 shadow-s1 dark:shadow-s5 rounded-full border border-gray-100 dark:border-gray-800 flex-shrink-0 mr-2 css-1ayes8q \" src=\"https://firebasestorage.googleapis.com/v0/b/deweb-519a7.appspot.com/o/profileImages%2Fbbs.market%2F${element.split('@')[0].toLowerCase()}?alt=media \"><a href=\"/${tokenName}/profile/${element}\" dir=\"ltr \" data-test=\"text \" class=\"text-sm mr-2 link css-shxbls \">${element}</a></div><span id=\"delete-btn-${index}\" dir=\"ltr \" data-test=\"text \" class=\"flex-shrink-0 text-sm font-medium transition css-shxbls cursor-pointer\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"></path></svg></span></div>`
            setTimeout(()=>{
                $('#userItemList').append(html)
                $('#delete-btn-'+index).on({click:function(event){
                    console.log("removeBlockUser",element)
                    removeBlockUser(element)
                }})
            },1)
        }
        $('.flex-1,.d-none,.d-md-flex').filter(":first").after("<div id=\"efioewj\" class=\"relative\"><div id=\"blockList-btn\" class=\"mr-3\"><div id=\"bl-btn\" data-test=\"button\" class=\"transition relative flex items-center justify-center leading-none cursor-pointer shadow-s1 dark:shadow-s5 bg-gray-50 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-200  css-xc709b\"> <span data-test=\"icon\" class=\"cursor-pointer transition flex justify-center items-center   css-1ovarfw\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\" css-1tg8k9x\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"> <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" /></svg></span></div> </div> </div>")
        $('#blockList-btn').after('<div id=\"blockList\" class=\"transition bg-white dark:bg-gray-900 shadow-s1 dark:shadow-s4 css-1stg9h5\"><div data-test=\"card \" class=\"transition lg:rounded-lg p-4 lg:p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 shadow-s1 dark:shadow-s4 w-96 rounded-md css-en1cq3 css-1u8qly9 \"><div class=\"flex items-center p-4 border-b-4\"><span dir=\"ltr \" data-test=\"text \" class=\"flex-1 text-sm font-medium text-gray-900 dark:text-gray-50 css-shxbls select-none\">Block User List</span></div><div data-test=\"hr\" class=\"h-px w-full transition bg-gray-100 dark:bg-gray-800 shadow-s2 dark:shadow-s6 bg-primary-500 dark:bg-primary-500  css-1u8qly9\"></div><div id=\"userItemList\" class=\"overflow-auto divide-y divide-gray-100 dark:divide-gray-800\" style=\"width:300px\"></div></div></div>')
        $('body').on({click:function(e){
            showblockUserList=false
            showBlockUserList()
        }})
        $("#blockList-btn").on({click:function(event){
            showblockUserList=!showblockUserList
            if (event && event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            showBlockUserList()
        }})
        $("#blockList").on({click:function(event){
            if (event && event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }})
    }
    function showBlockUserList(){
        $("#blockList").toggleClass('css-1stg9h5',!showblockUserList)
        $("#blockList").toggleClass('css-1kaoat8',showblockUserList)
        $("#bl-btn").toggleClass('bg-gray-50',!showblockUserList)
        $("#bl-btn").toggleClass('bg-primary-500',showblockUserList)
        $("#bl-btn").toggleClass('dark:bg-gray-800',!showblockUserList)
        $("#bl-btn").toggleClass('dark:bg-primary-500',showblockUserList)
        $("#bl-btn").toggleClass('text-gray-500',!showblockUserList)
        $("#bl-btn").toggleClass('text-gray-50',showblockUserList)
        $("#bl-btn").toggleClass('dark:text-gray-100',!showblockUserList)
        $("#bl-btn").toggleClass('dark:text-gray-900',showblockUserList)
        $("#bl-btn").toggleClass('hover:bg-gray-200',!showblockUserList)
        $("#bl-btn").toggleClass('dark:hover:bg-gray-700',!showblockUserList)
        $("#bl-btn").toggleClass('hover:text-gray-600',!showblockUserList)
        $("#bl-btn").toggleClass('dark:hover:text-gray-200',!showblockUserList)
    }
    function changeURLArg(url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
    }
})();