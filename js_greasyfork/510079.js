// ==UserScript==
// @name         聆音club图书发布辅助
// @namespace    http://tampermonkey.net/
// @version      2024-09-27
// @description  在聆音书箱发布页面上收集豆瓣书籍信息并回填
// @author       Euzen
// @match        https://pt.soulvoice.club/upload.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soulvoice.club
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510079/%E8%81%86%E9%9F%B3club%E5%9B%BE%E4%B9%A6%E5%8F%91%E5%B8%83%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/510079/%E8%81%86%E9%9F%B3club%E5%9B%BE%E4%B9%A6%E5%8F%91%E5%B8%83%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let pstorageToken='Lfx9NiLmGyCkdvn3UkYFQzcchhQEr3hVlYRJ6bh7vQS2QSzhrK+u8/UaukXzSZvoVrv776zu57KlclazY9cpYw==';
    // let pstorageToken='KQeyogJdfHnIZmv5leud125URwXzLUoQl4LoxeBhZ0CYEC3FpcHot5FlSm4gcm5/noq2vziPhKh9D/qeLmcr9A==';
    let ImgbbToken='1304252c56a973a9bb9626276e225268304ec4d8';

    let ImgbbApikey = 'your_api_key';
    //需在ImgURL注册用户和申请uid和token
    //https://www.imgurl.org/vip/user#user=login
    let ImgurlUid='your_api_uid';
    let ImgurlToken='your_api_token';

    // 从 url 下载 blob
    let getBlobFromUrl = (downurl,site) => {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'blob',
                url: downurl,
                onload: function (res){
                    if (site == "ImgBBu")
                    {
                        let reader = new FileReader();
                        reader.readAsDataURL(res.response);
                        reader.onloadend = function () {
                            let base64String = reader.result;
                            // console.log('Base64 String - ', base64String);
                            // Simply Print the Base64 Encoded String,
                            // without additional data: Attributes.
                            // console.log('Base64 String without Tags- ', base64String.substr(base64String.indexOf(',') + 1));
                            resolve(base64String.substr(base64String.indexOf(',') + 1));
                        }
                    }
                    else
                    {
                        resolve(res.response);
                    }
                },
                onerror: res =>{reject('Resoonse error'+res.status)},
                ontimeout: function(){reject('Timeout')},
            });
        });
    }

    //上传到图床
    let uploadCoverPic = (picBlob,site) => {

        return new Promise(function (resolve, reject) {
            console.log("图床：",site);
            let formData = new FormData();
            let upUrl = "https://api.imgbb.com/1/upload";
            if (site == "pstorage")
            {
                formData.append('authenticity_token',pstorageToken);
                formData.append('upload[uploaded_file]',picBlob,"image.jpg");
                upUrl = "https://pstorage.space/uploads";
            }
            else if (site == "ImgBBu")
            {
                formData.append('image', picBlob);
                formData.append('key',ImgbbApikey);
                upUrl = "https://api.imgbb.com/1/upload";
            }
            else if (site == "ImgBB")
            {
                formData.append('type','file');
                formData.append('action','upload');
                formData.append('auth_token',ImgbbToken);
                formData.append('source',picBlob,"image.jpg");
                upUrl = "https://imgbb.com/json";
            }
            else if (site == "ImgURL")
            {
                formData.append('uid',ImgurlUid);
                formData.append('token',ImgurlToken);
                formData.append('file',picBlob,"image.jpg");
                upUrl = 'https://www.imgurl.org/api/v2/upload';
            }
            GM_xmlhttpRequest({
                method:'POST',
                url:upUrl,
                data:formData,
                onload:function(response){
                    console.log(response.responseText);
                    let data={}
                    let imgUrl='error image url';
                    try {
                        data = JSON.parse(response.responseText);
                        if (site=='ImgBBu' || site=='ImgURL')
                        {
                            imgUrl = data.data.url;
                        }
                        else if (site=='pstorage')
                        {
                            imgUrl = data.files[0].url;
                        }
                        else if (site=='ImgBB')
                        {
                            imgUrl = data.image.url;
                        }
                        resolve(imgUrl);
                    }
                    catch (e) {
                        console.log(e);
                        resolve(false);
                    }
                },
                onerror:response =>{reject('Resoonse error'+response.status);},
                ontimeout:function(){reject('Upload Timeout.');}
            });
        })
            // .then(res=>{console.log('yyyyyy'+res)}).catch(e=>{console.log('xxxxx:'+e);})

    }

    let isCJK = (char) => {
        return /\p{Unified_Ideograph}/u.test(char);
    }
    function getBookInfo() {
        let obj=document.querySelector("#input01");
        let sel=document.querySelector("#select01");
        let msgdiv=document.querySelector("#div01");
        let msgspan=document.querySelector("#span01");
        msgdiv.style.display="";

        if (obj.value != "")
        {
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 3000,
                url: obj.value,
                onload: function(response){
                    console.log("请求成功");
                    //console.log(response.responseText);
                    // let dt=document.implementation.createDocumentType("html", "-//W3C//DTD HTML 4.01 Transitional//EN", "http://www.w3.org/TR/html4/loose.dtd");
                    // let doc = document.implementation.createDocument(null, null, dt);
                    let html = document.createElement('html');
                    html.innerHTML = response.responseText.replace(/^[\s]*/mg, "").replace(/\n(<a)/mg, "$1");
                    let bookInfo={};
                    // 标题
                    bookInfo.title = html.querySelector('#wrapper h1 span').innerText;
                    let elDivArticle = html.querySelector('#content .article');
                    // 封面
                    bookInfo.coverPicUrl = elDivArticle.querySelector('#mainpic a').href;
                    // console.log(bookInfo.coverPicUrl);

                    // info块
                    let infoBlockText = elDivArticle.querySelector('#info').innerText.trimEnd();
                    // console.log(elDivArticle.querySelector('#info'));
                    // console.log(infoBlockText);
                    let infoBlockItems = infoBlockText
                    .split('\n')
                    .map((i) => {
                        let [key, value] = i.split(':');
                        if (key != undefined)
                        {
                            key = key.trim();
                        }
                        if (value != undefined)
                        {
                            value = value.trim();
                        }
                        return [key, value];
                    });
                    let infoBlock = Object.fromEntries(infoBlockItems);
                    bookInfo.infoBlockText = infoBlockText;
                    bookInfo.infoBlockItems = infoBlockItems;
                    bookInfo.infoBlock = infoBlock;
                    //console.log(bookInfo.infoBlock);
                    //简介
                    let elDivRelatedInfo = elDivArticle.querySelector('.related_info');
                    // console.log(elDivRelatedInfo);
                    for (let elH2 of elDivRelatedInfo.querySelectorAll('h2')) {
                        let getText = (el) => {
                            let elDivIntro = el.nextElementSibling.querySelector('.all .intro');
                            if (!elDivIntro) {
                                elDivIntro = el.nextElementSibling.querySelector('.intro');
                            }
                            return Array.from(elDivIntro.querySelectorAll('p'))
                                .map(i => i.innerText)
                                .join('\n\n');
                        };
                        if (elH2.innerText.startsWith('\n内容')) {
                            bookInfo.contentIntro = getText(elH2);
                        }
                        if (elH2.innerText.startsWith('作者简介')) {
                            bookInfo.authorIntro = getText(elH2);
                        }
                    }

                    let uploadBookCoverPic = async (site) => {
                        if (!bookInfo.coverPicBlob) {
                            console.log(`[DEBUG] 下载封面图片 ${bookInfo.coverPicUrl}`);
                            msgspan.innerText = "正在处理，下载封面中...";
                            bookInfo.coverPicBlob = await getBlobFromUrl(bookInfo.coverPicUrl,site);
                            console.log(`[DEBUG] 封面图片下载成功`);
                        }
                        if (!bookInfo.newCoverPicUrl) {
                            console.log(`[DEBUG] 上传封面图片到${site}`);
                            msgspan.innerText = "正在处理，上传封面到图床...";
                            let newPicUrl = await uploadCoverPic(bookInfo.coverPicBlob,site);
                            // let newPicUrl = uploadCoverPic(bookInfo.coverPicBlob,site);
                            console.log('[DEBUG] 上传结果', newPicUrl);
                            bookInfo.newCoverPicUrl = newPicUrl;
                            if (!newPicUrl)
                            {
                                msgspan.innerText = '上传到图床失败！';
                            }
                        }
                        fillForm(bookInfo);
                    }

                    //上传到图床
                    let site=sel.options[sel.selectedIndex].value;
                    if (site == "ImgBBu")
                    {
                        if (ImgbbApikey.length != 32)
                        {
                            msgspan.innerText = "ImgBB未申请Apikey,申请后填写到脚本上";
                            return false;
                        }
                    }
                    else if (site == "ImgURL")
                    {
                        if (ImgurlUid.length != 32 || ImgurlToken.length != 32)
                        {
                            msgspan.innerText = "ImgURL未申请Apikey,申请后填写到脚本上";
                            return false;
                        }
                    }
                    uploadBookCoverPic(site);

                    let fillForm = (bookInfo) => {
                        // console.log(bookInfo.contentIntro);
                        // 标题（完整书名）
                        if (bookInfo.title) {
                            let fullname;
                            if (bookInfo.infoBlock['副标题']) {
                                fullname = `${bookInfo.title}：${bookInfo.infoBlock['副标题']}`;
                            } else {
                                fullname = bookInfo.title;
                            }
                            let fillText = document.querySelector('#name');
                            fillText.value = fullname;
                        }
                        // 副标题
                        if (bookInfo.infoBlock['作者']) {
                            let items = [];
                            let fields = ['作者', '译者', '出版社', '出版年'];
                            for (let field of fields) {
                                if (bookInfo.infoBlock[field]) {
                                    items.push(`${field}: ${bookInfo.infoBlock[field]}`);
                                }
                            }
                            let fillText = document.querySelector('#compose > table > tbody > tr:nth-child(4) > td.rowfollow > input[type=text]');
                            fillText.value = items.join(' | ');
                        }
                        //拼接简介部分
                        let desc = [];
                        // 封面
                        if (bookInfo.coverPicUrl) {
                            // console.log('new',bookInfo.newCoverPicUrl);
                            // console.log('old',bookInfo.coverPicUrl);
                            let coverPicUrl = bookInfo.newCoverPicUrl || bookInfo.coverPicUrl;
                            desc.push(...[
                                `[img]${coverPicUrl}[/img]`,
                                '\n\n',
                            ]);
                        }
                        // info块
                        if (bookInfo.infoBlockText) {
                            for (let [field, value] of bookInfo.infoBlockItems) {
                                if (Array.from(field).every(isCJK)) {
                                    if (field.length === 1) {
                                        let c1 = field;
                                        field = `◎${c1}　　　`;
                                    }
                                    else if (field.length === 2) {
                                        let [c1, c2] = field;
                                        field = `◎${c1}　　${c2}`;
                                    } else if (field.length === 3) {
                                        let [c1, c2, c3] = field;
                                        field = `◎${c1}  ${c2}  ${c3}`;
                                    } else {
                                        field = '◎' + field;
                                    }
                                } else if (field === 'ISBN') {
                                    field = '◎ISBN     ';
                                } else {
                                    field = '◎' + field;
                                }
                                if (value != undefined)
                                {
                                    desc.push(`${field}　${value}\n`);
                                }
                            }
                            desc.push('\n');
                        }
                        // 作者简介
                        if (bookInfo.contentIntro) {
                            desc.push(...[
                                `[b][size=4]内容简介[/size][/b]\n\n`,
                                bookInfo.contentIntro,
                                '\n\n\n',
                            ]);
                        }

                        // 作者简介
                        if (bookInfo.authorIntro) {
                            desc.push(...[
                                `[b][size=4]作者简介[/size][/b]\n\n`,
                                bookInfo.authorIntro,
                                '\n\n\n',
                            ]);
                        }

                        // 豆瓣链接
                        let bookUrl = obj.value;
                        // console.log(bookUrl);
                        desc.push(...[
                            `[img]https://i.loli.net/2021/10/25/TdO1JRobApl2C6Y.png[/img]\n\n`,
                            `[size=5][url=${bookUrl}]${bookUrl}[/url][/size]\n`,
                        ]);
                        let fillText = document.querySelector('#descr');
                        fillText.value = desc.join("");
                        //完成后提示
                        if (bookInfo.newCoverPicUrl)
                        {
                            msgspan.innerText = "操作完成。";
                            msgdiv.style.backgroundColor = "green";
                        }
                    }
                },
                onerror: function(response){
                    console.log("请求失败");
                    msgspan.innerText="读取豆瓣数据失败，请重试";
                },
                ontimeout: function() {
                    console.log("请求超时");
                    msgspan.innerText="读取豆瓣数据超时，请重试";
                }
            });
        }
        else
        {
            alert("豆瓣书籍url不能为空");
        }
    }

    // Your code here...
    // let obj=document.querySelector('#compose > table > tbody > tr:nth-child(4) > td.rowfollow > input[type=text]');
    // obj.value="isok";
    function CrElem(action)
    {
        let obj=document.querySelector('#compose > table > tbody > tr:nth-child(1) > td');
        let n1=document.createElement("p");
        let n2=document.createElement("span");
        n2.innerText = "豆瓣URL：";

        let inp1=document.createElement("input");
        inp1.name="input01";
        inp1.id="input01";
        inp1.size="60";
        inp1.type="text";
        inp1.value='https://book.douban.com/subject/20632628/';

        let sel=document.createElement("select");
        let opt1 = document.createElement("option");
        let opt2 = document.createElement("option");
        let opt0 = document.createElement("option");
        sel.style = "margin-left:5px;margin-right:5px;";
        sel.id = "select01";
        opt0.text="pstorage";
        opt0.value="pstorage";
        sel.add(opt0);
        opt1.text = "ImgBB";
        opt1.value = "ImgBB";
        sel.add(opt1);
        opt2.text = "ImgURL";
        opt2.value = "ImgURL";
        sel.add(opt2);


        let but1=document.createElement("input");
        but1.name="button01";
        but1.id="button01";
        but1.type="button";
        but1.value="提交";
        but1.onclick=action;
        //提醒信息
        let span = document.createElement('span');
        span.innerText = "正在处理，请稍候...";
        span.id="span01";
        let div = document.createElement('div');
        div.id="div01";
        div.style.cssText = 'background-color:red; padding-top: 2px;padding-bottom: 4px;display:none;';
        div.appendChild(span);

        obj.appendChild(n1);
        obj.appendChild(n2);
        obj.appendChild(inp1);
        obj.appendChild(sel);
        obj.appendChild(but1);
        obj.appendChild(div);
    }
    CrElem(getBookInfo);
})();