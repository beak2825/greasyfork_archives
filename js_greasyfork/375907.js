// ==UserScript==
// @name         bilibili右键简单下载所点击图片(支持所有位置的点击)
// @namespace    http://tampermonkey.net/
// @version      0.7.8
// @description  右键点击图片以下载(支持头像下载，番剧封面下载，视频封面下载，专栏图片下载，直播封面下载,甚至还有首页和空间上那一横条的下载)
// @author       Derek Chen
// @match        *://www.bilibili.com/*
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/read/cv*
// @include      *://t.bilibili.com/*
// @include      *://space.bilibili.com/*
// @include      *://www.bilibili.com/*
// @include      *://h.bilibili.com/*
// @include      *://game.bilibili.com/*
// @include      *://live.bilibili.com/*
// @include      *://search.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375907/bilibili%E5%8F%B3%E9%94%AE%E7%AE%80%E5%8D%95%E4%B8%8B%E8%BD%BD%E6%89%80%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%28%E6%94%AF%E6%8C%81%E6%89%80%E6%9C%89%E4%BD%8D%E7%BD%AE%E7%9A%84%E7%82%B9%E5%87%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/375907/bilibili%E5%8F%B3%E9%94%AE%E7%AE%80%E5%8D%95%E4%B8%8B%E8%BD%BD%E6%89%80%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%28%E6%94%AF%E6%8C%81%E6%89%80%E6%9C%89%E4%BD%8D%E7%BD%AE%E7%9A%84%E7%82%B9%E5%87%BB%29.meta.js
// ==/UserScript==

let header = 'https:',
    acceptable_classes = ['user-head c-pointer', 'notice-img c-pointer', 'img-content', 'live-up-img', 'card-1', 'card-3'],
    final_url = "",
    header_test = new RegExp(/http*/),
    prompt = document.createElement("div"),
    first_hid = true,
    up_name_final = "",
    img_list = [],
    detail_ = {

    };


initiate_pop();

function initiate_pop() {
    prompt.setAttribute('id', 'pop');
    prompt.setAttribute('style', `
            width:${window.innerWidth / 4}px;
            min-height:100px;
            position:fixed;
            top: -500px;
            left:${window.innerWidth / 3}px;
            border:solid 1px gray;
            border-radius:10px;
            background: rgb(237,237,237);
            z-index:99999;
            transition-duration: 500ms;
            max-height:500px;
            overflow :auto;
        `);
    prompt.innerHTML = `
        <h2>你想下载那张图片？</h2>
    `
    document.body.appendChild(prompt);
}

function make_img_list_prompt(arr,u_arr) {
    let done = [],
        current_index = -1;
    document.getElementById('pop').innerHTML = "<h2>你想下载那张图片？</h2>";
    for (let i = 0; i < arr.length; i++) {
        let finished = false;
        for (let j = 0; j < done.length; j++) {
            if (arr[i] === done[j]) {
                finished = true;
            }
        }
        if (!finished && arr[i] !== '') {
            let img = new Image(),
                div = document.createElement('div'),
                name = document.createElement('p');
            current_index = i;
            name.innerText = u_arr[current_index];
            div.style.display = 'inline-block';
            div.setAttribute('class','pop_container')
            div.style.textAlign = 'center';
            div.appendChild(img);
            div.appendChild(name);
            img.setAttribute('class', 'pop_img')
            img.src = arr[i];
            img.style.width = `${window.innerWidth/8.5}px`;
            img.style.marginLeft = `${window.innerWidth/350/3}px`;
            document.getElementById('pop').appendChild(div);
            done.push(arr[i]);
        }
    }
    document.getElementById('pop').style.top = '0px';
    console.log(arr,u_arr)
}

function get_all_img() {
    let f_url_arr = [],
        u_name_arr = [],
        all_img = document.getElementsByTagName('img');
    for(let a = 0; a < all_img.length;a++){
        f_url_arr.push(all_img[a].src.split('@')[0].split('"')[0]);
        u_name_arr.push(get_name(all_img[a]));
    }
    for (let i = 0; i < acceptable_classes.length; i++) {
        let t = document.getElementsByClassName(acceptable_classes[i]);
        for (let j = 0; j < t.length; j++) {
            if (t[j].nodeName === 'IMG') {
                u_name_arr.push(get_name(t[j]));
                f_url_arr.push(t[j].src.split('@')[0].split('"')[0]);
            } else {
                if (header_test.test(t[j].style.backgroundImage)) {
                    u_name_arr.push(get_name(t[j]));
                    f_url_arr.push(t[j].style.backgroundImage.replace('url("', '').split('@')[0].split('"')[0]);
                } else {
                    u_name_arr.push(get_name(t[j]));
                    f_url_arr.push(t[j].style.backgroundImage.replace('url("', header).split('@')[0].split('"')[0]);
                }
            }
        }
    }
    make_img_list_prompt(f_url_arr,u_name_arr);
    // console.log(f_url_arr);
}

function check_identical(link) {
    if (img_list.length !== 0) {
        for (let i = 0; i < img_list.length; i++) {
            if (link === img_list[i]) {
                return true;
            }
        }
    }
    return false;
}

function download(url = final_url) {
    console.log(final_url);
    if (check_identical(url.url)) {
        alert("已经下载过这张图片了!");
        return;
    }

    if(!detail_[url.name]){
        detail_[url.name] = 1;
    }else{
        detail_[url.name] += 1;
    }
    try{
        current_img_type = url.url.substring(url.url.lastIndexOf("."));
        img_list.push(url.url);

        fetch(url.url).then(res => res.blob()).then(blob => { //创建临时a标签以下载图片

            let a = document.createElement('a');

            a.style.display = 'none';
            a.href = URL.createObjectURL(blob);
            a.download = `${url.name}${detail_[url.name] + current_img_type}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            link = '';
        });
    }catch(e){/*nobody cares*/};
}

function get_url(target) {
    if (target.nodeName === 'IMG') {
        final_url = {
            url: target.src.split('@')[0].split('"')[0],
            name: get_name(target)
        };
        return true;
    } else {
        for (let i = 0; i < acceptable_classes.length; i++) {
            if (target.classList.value === acceptable_classes[i]) {
                if (target.nodeName !== 'IMG') {
                    final_url = {
                        url: header_test.test(target.style.backgroundImage) ? 
                            target.style.backgroundImage.replace('url("', '').split('@')[0].split('"')[0] : 
                            target.style.backgroundImage.replace('url("', header).split('@')[0].split('"')[0],
                        name: get_name(target)
                    };
                    return true;
                }
            }
        }
    }
}

document.oncontextmenu = (e) => {
    console.log(e,'right click');
    let target = e.target,
        find_element = false;

    if (target.nodeName === 'IMG') {
        final_url = {
            url: target.src.split('@')[0].split('"')[0],
            name: get_name(target)
        };
        // console.log(final_url);
        download();
        return;
    }

    find_element = get_url(target);
    if (!find_element) {
        get_all_img();
    }
    download();
}

function get_name(ele){
    let name = "";
    while (ele) {
        if(ele.classList){
            switch(ele.classList.value){
                case 'pop_img':
                    name = ele.parentNode.innerText;
                    break;
                case 'post-content repost':
                    if(ele.getElementsByClassName('original-poster')[0]){
                        name = ele.getElementsByClassName('original-poster')[0].innerText.split('@')[1].split(':')[0];
                    }else{
                        name = ele.getElementsByClassName('username d-i-block up-info-name')[0].innerText;
                    }
                    break;
                case 'main-content':
                case 'card':
                    name = ele.getElementsByClassName('user-name fs-16 ls-0 d-i-block')[0].innerText;
                    break;
                case 'live-panel-item live-up':
                    name = ele.getElementsByClassName('live-up-name tc-dark-slate fs-14 ls-0')[0].innerText;
                    break;
                case 'list-item reply-wrap ':
                    name = ele.getElementsByClassName('name')[0].innerText;
                    break;
                case 'card-box':
                    name = ele.getElementsByClassName('count up')[0].innerText;
                    break;
                default:
                    null; // still, nobody cares
            }
        }
        ele = ele.parentNode;
    }
    return name;
}

document.addEventListener('mouseup',(e)=>{
    console.log(e)
    if (e.target.classList.value === 'pop_img' || e.target.classList.value === 'pop_container' || e.target.id === 'pop' ) {
        // console.log('a')
        document.getElementById('pop').style.top = '0px';
        first_hid = false;
        return;
    }
    if (first_hid) {
        document.getElementById('pop').style.top = '-510px';
        first_hid = !first_hid;
    } else {
        document.getElementById('pop').style.top = '-460px';
        first_hid = !first_hid;
    }
})