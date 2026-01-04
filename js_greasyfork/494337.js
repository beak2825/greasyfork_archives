// ==UserScript==
// @name         nhentai收藏分享
// @namespace    http://github.com/pingfanh/
// @version      2024-05-27.1
// @description  一个用于将nhentai的收藏分享给其他人的插件！在每一页点击保存收藏后，其他人可以在你的主页看到你的收藏！
// @author       pingfanH
// @match        https://nhentai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494337/nhentai%E6%94%B6%E8%97%8F%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/494337/nhentai%E6%94%B6%E8%97%8F%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

const BASE_URL="http://49.232.237.42:8556/";
(function() {
    'use strict';

    if(window.location.pathname.includes("favorites")){
        favorite_page()
    }
    if(window.location.pathname.includes("/users/")){
        user_page()
    }
    //if(window.location.pathname.includes("/g/")){
    //    manga_fix()
    //}
    // Your code here...
})();
function manga_fix(){
    var container = document.getElementById("image-container");
    container.addEventListener('click', function() {
        setScrollProgress(0);
        console.log("setScrollProgress")
    });
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowLeft'||event.code === 'ArrowRight') {
            setScrollProgress(0);
            console.log("setScrollProgress")
        }
    });

}
function setScrollProgress(progress) {
    var totalHeight = document.body.scrollHeight - window.innerHeight;
    var scrollPosition = (progress / 100) * totalHeight;
    window.scrollTo(0, scrollPosition);
}
function user_page(){
    let path = window.location.pathname.split("/");
    console.log(path)
    var location_search = new URLSearchParams(document.location.search);
    var page_ = location_search.get('page');
    page_=page_==null?1:page_;
    var page=parseInt(page_)
    let id=path[2];
    let favoriteDiv = document.getElementById("recent-favorites-container");
    favoriteDiv.children[0].innerHTML='<h2><i class="fa fa-heart color-icon"></i>Favorites</h2>'
    var galleryElements = favoriteDiv.querySelectorAll('.gallery');
    galleryElements.forEach(function(element) {
     element.remove(); // 从 DOM 中删除元素
    });
    GM_xmlhttpRequest({
        method: "GET",
        url: BASE_URL+"api/query?id="+id,
        headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
         },
        data:"content=erwer",
        onload: function(response){
            let data = JSON.parse(response.responseText);
            let favorites = JSON.parse(data.favorites);
            console.log(favorites)
            for(const i of favorites[page-1]){
             favoriteDiv.appendChild(new_gallery(i.href,i.caption,i.cover,i.tags))
            }
            favoriteDiv.appendChild(pagination(favorites.length,page))
        },
         onerror: function(response){
          console.log("请求失败");
        }
      });


}
function favorite_page(){
        var div = document.createElement('div');
        div.style.display="flex";
        div.style.position = 'fixed';
        div.style.top = '60px';
        div.style.left = '30px';
        div.style.zIndex = '9999';

        var prev_button = new_button("上一页")
        div.appendChild(prev_button)
        var button = new_button("保存收藏");
        div.appendChild(button)
        var next_button = new_button("下一页")
        div.appendChild(next_button)

        document.body.appendChild(div);

        prev_button.addEventListener('click', function() {
            page_change("prev");
        });
        button.addEventListener('click', function() {
            collecting();
        });
        next_button.addEventListener('click', function() {
            page_change("next");
        });

}

function page_change(action){
    var location_search = new URLSearchParams( window.location.search);
    var page = location_search.get('page');
    page=page!=null?parseInt(page):1
    console.log(page)
    if(action=="prev"){
        if(page==1){alert("已经是第一页了");return}
        page-=1;
    }else{
        page+=1;
    }
    console.log(page)
    location_search.set("page",page);
    console.log(location_search.toString())
    window.location.search=location_search.toString();
    console.log(window.location.href)
    //window.location.replace();
}

function new_button(text){
    var button = document.createElement('button');
    button.innerHTML = text;

    button.style.zIndex = '9999';
    button.classList="btn btn-primary btn-thin remove-button"
    return button
}

function collecting(){
  let list = mangaList();
  if(list==null){
    var location_search = new URLSearchParams(document.location.search);
    var page = location_search.get('page');
    if(page==null){alert("没有任何收藏！"); return}
    alert("此页无收藏"); return
  }
  console.log(list);
  hasOtherPage();
  let user_data=getUserData();
//   fetch(BASE_URL+"api/update",{
//     method:"POST",
//     body:JSON.stringify({
//         "user_id":user_data.id,
//         "name":user_data.name,
//         "page":list.page,
//         "data":JSON.stringify(list.data)
//     })
//   }).then(function(response) {
//     return response.text();
// }).then(function(data) {
//     console.log(data)
// })

GM_xmlhttpRequest({
    method: "POST",
    url: BASE_URL + "api/update",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    data: JSON.stringify({
        "user_id": user_data.id,
        "name": user_data.name,
        "page": list.page,
        "data": JSON.stringify(list.data)
    }),
    onload: function(response) {
        if (response.status >= 200 && response.status < 300) {
            console.log(response.responseText);
        } else {
            console.error('Request failed with status:', response.status);
        }
    },
    onerror: function(err) {
        console.error('GM_xmlhttpRequest failed:', err);
    }
});

}
function hasOtherPage(){
    let pagination = document.getElementsByClassName("pagination");
    console.log(pagination)
}
function mangaList(){
    let mangaList = document.getElementsByClassName("gallery-favorite");
    if(mangaList.length==0){
        return null
    }
    let mangaListData=[];
    for(const i of mangaList){
        let mangaTemp={}
        mangaTemp.href = i.querySelector('.cover').href
        mangaTemp.cover = i.querySelector('.lazyload').getAttribute("data-src")
        mangaTemp.caption = i.querySelector('.caption').innerHTML
        mangaTemp.tags=i.querySelector('.gallery').getAttribute("data-tags")
        mangaListData.push(mangaTemp)
    }
    var location_search = new URLSearchParams(document.location.search);
    var page = location_search.get('page');
    console.log(page)
    page=page==null?1:page;
    let mangaData={
        "data":mangaListData,
        "page":parseInt(page)
    }
    return mangaData
}
function getUserData(){
    //let user =document.getElementsByClassName("menu right")[0];
    var Elements = document.querySelectorAll('ul.menu.right li');
    var user=Elements[1];
    let href=user.querySelector("a").getAttribute("href");
    let data=href.split("/");

    return {
        "id":parseInt(data[2]),
        "name":data[3]
    }
}

function new_gallery(href,caption,cover,tags){

    // 创建一个新的 div 元素
    var newDiv = document.createElement('div');

    // 设置 div 元素的 class
    newDiv.className = 'gallery';

    // 设置 div 元素的 data-tags
    newDiv.setAttribute('data-tags', tags);

    // 设置 div 元素的内容
    newDiv.innerHTML = '<a href="' + href + '" class="cover" style="padding:0 0 139.2% 0"><img class="lazyload" width="250" height="348" data-src="' + cover + '" src="' + cover + '"><noscript><img src="' + cover + '" width="250" height="348"  /></noscript><div class="caption">' + caption + '</div></a>';

    return newDiv

}

function pagination(pages,page_){
    var path = window.location.origin+window.location.pathname;
    // 创建分页元素
    var paginationSection = document.createElement('section');
    paginationSection.className = 'pagination';

    var page = parseInt(page_)
    console.log(page)
    if(page!=1){
    // 创建第一页链接
    var firstPageLink = document.createElement('a');
    firstPageLink.href =path+ '?page=1';
    firstPageLink.className = 'last';
    var firstPageIcons = document.createElement('span');
    firstPageIcons.innerHTML = '<i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i>';
    firstPageLink.appendChild(firstPageIcons);
    paginationSection.appendChild(firstPageLink);
    // 创建上一页链接
    var prevPageLink = document.createElement('a');
    prevPageLink.href = path+'?page='+(page-1);
    prevPageLink.className = 'next';
    var prevPageIcon = document.createElement('i');
    prevPageIcon.className = 'fa fa-chevron-left';
    prevPageLink.appendChild(prevPageIcon);
    paginationSection.appendChild(prevPageLink);


    }

    // 创建分页链接
    for (var i = 1; i <= pages; i++) {
        var pageLink = document.createElement('a');
        pageLink.href = path+'?page=' + i;
        pageLink.className = 'page' + (i == page ? ' current' : ''); // 第一页添加 current 类
        pageLink.textContent = i;
        paginationSection.appendChild(pageLink);
    }
    if(page!=pages){
    // 创建下一页链接
    var nextPageLink = document.createElement('a');
    nextPageLink.href = path+'?page='+(page+1); // 下一页链接指向第二页
    nextPageLink.className = 'next';
    var nextPageIcon = document.createElement('i');
    nextPageIcon.className = 'fa fa-chevron-right';
    nextPageLink.appendChild(nextPageIcon);
    paginationSection.appendChild(nextPageLink);

    // 创建最后一页链接
    var lastPageLink = document.createElement('a');
    lastPageLink.href =path+ '?page='+pages; // 最后一页链接指向第三页
    lastPageLink.className = 'last';
    var lastPageIcons = document.createElement('span');
    lastPageIcons.innerHTML = '<i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i>';
    lastPageLink.appendChild(lastPageIcons);
    paginationSection.appendChild(lastPageLink);
    }
    return paginationSection
}