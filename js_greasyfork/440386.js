// ==UserScript==
// @name         bangumi过滤搜索结果
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      0.3.3
// @description  自动去除标签搜索结果中错误的结果，手动去除你认为错误的标签或关键词搜索结果，下次搜索时将自动过滤
// @author       Liaune
// @license      MIT
// @include     /^https?://(bgm\.tv|chii\.in|bangumi\.tv)/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440386/bangumi%E8%BF%87%E6%BB%A4%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/440386/bangumi%E8%BF%87%E6%BB%A4%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
	// 检测 indexedDB 兼容性，因为只有新版本浏览器支持
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
    // 初始化 indexedDB
    const dbName = 'Bangumi_Subject_Tags';
    const tableName = 'tags';
    const indexName = 'id';
    if (indexedDB) {
        let request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = evt => {
            let db = evt.target.result;
            let objectStore = db.createObjectStore(tableName, {keyPath: indexName});
        }
        request.onsuccess = evt => {
            //removeCache();
        }
    }
    // 用来记录已经被使用的缓存列表
    let cacheLists = [];
    // 获取本地缓存
    function getCache(itemId, callback) {
        let request = indexedDB.open(dbName, 1);
        request.onsuccess = evt => {
            let db = evt.target.result;
            let transaction = db.transaction([tableName], 'readonly');
            let objectStore = transaction.objectStore(tableName);
            let reqInfo = objectStore.get(itemId);
            reqInfo.onsuccess = evt => {
                let result = evt.target.result;
                if(!!result) {
                    cacheLists.push(itemId);
                    callback(true, result.value.content);
                } else {
                    callback(false);
                }
            }
            reqInfo.onerror = evt => {
                callback(false);
            }
        };
    }
    // 记录到本地缓存
    function setCache(itemId, data) {
        let request = indexedDB.open(dbName, 1);
        request.onsuccess = evt => {
            let db = evt.target.result;
            let transaction = db.transaction([tableName], 'readwrite');
            let objectStore = transaction.objectStore(tableName);
            let cache = {
                content: data,
                created: new Date()
            };
            let reqInfo = objectStore.put({id: itemId, value: cache})
            reqInfo.onerror = evt => {
                // console.log('Error', evt.target.error.name);
            }
            reqInfo.onsuccess = evt => {}
        };
    }
    // 清除和更新缓存
    function removeCache() {
        let request = indexedDB.open(dbName, 1);
        request.onsuccess = evt => {
            let db = evt.target.result;
            let transaction = db.transaction([tableName], 'readwrite'),
                store = transaction.objectStore(tableName),
                cacheTime = 1000*3600*24*7*4; //4周
            store.openCursor().onsuccess = evt => {
                let cursor = evt.target.result;
                if (cursor) {
                    if (cacheLists.indexOf(cursor.value.name) !== -1) {
                        cursor.value.created = new Date();
                        cursor.update(cursor.value);
                    } else {
                        let now = new Date(),
                            last = cursor.value.created;
                        if (now - last > cacheTime) {
                            cursor.delete();
                        }
                    }
                    cursor.continue();
                }
            }
        };
    }



    let itemsList,blacklist,type,key,count=0,see=0;
	const hotTags = ['TV','剧场版','漫画改','原创','搞笑','OVA','轻小说改','里番'];

    if(localStorage.getItem('bangumi_result_blacklist'))
        blacklist = JSON.parse(localStorage.getItem('bangumi_result_blacklist'));
    else
        blacklist = {"tag":{},"subject_search":{}};
    //let match = decodeURI(location.href).match(/(tag|subject_search)\/(\S+)(\/|.?).*/);
    let match = decodeURI(location.pathname).match(/(tag|subject_search)/);
    if(match){
        type = match[1];
		let arr = decodeURI(location.pathname).split('/');
		let index = arr.findIndex((e)=> e == type);
        key = arr[index+1];
        let showBtn = document.createElement('li');
        let select = document.createElement('a'); $(select).css({"background-image": "url(https://i.loli.net/2018/11/04/5bdef15ba9076.png)","background-size": "1600px 2444px","background-position": "-405px -1045px"});
        select.href='javascript:;';
        if(document.querySelectorAll('#browserTypeSelector li')[0]) document.querySelector('#browserTypeSelector').insertBefore(showBtn, document.querySelectorAll('#browserTypeSelector li')[0]);
        showBtn.appendChild(select);
        select.addEventListener('click', filter);

        filter();
        see = 0;
    }
    function filter(){
        count = 0;
        itemsList = document.querySelectorAll('#browserItemList li.item');
		if(!itemsList.length) return 0;
        see = (see==1)? 0 :1;
        if(!blacklist[type][key]) blacklist[type][key] = [];
        let fetchList = [];
        itemsList.forEach( (elem) => {
            let href = elem.querySelector('a.subjectCover').href;
            let ID = href.split('/subject/')[1];

			let hideBtn = document.createElement('a');  hideBtn.href='javascript:;';  hideBtn.className = 'delet-icon'; hideBtn.textContent = '☒'; hideBtn.style.float='right';
            hideBtn.addEventListener('click', function(){
                if(blacklist[type][key].includes(ID)){
                    blacklist[type][key].splice(blacklist[type][key].indexOf(ID),1);
                    alert("已将此条目从黑名单中移除");
                    localStorage.setItem('bangumi_result_blacklist',JSON.stringify(blacklist));
                }
                else{
                    $(elem).hide();
                    blacklist[type][key].push(ID);
                    localStorage.setItem('bangumi_result_blacklist',JSON.stringify(blacklist));
                }
            });
            if(!$(elem).find('.delet-icon').length) elem.appendChild(hideBtn);

            if(blacklist[type][key].includes(ID)){
                if(see) $(elem).hide();
                else $(elem).show();
                count++;
            }
            else if(type == 'tag'){
				getCache(ID, function(success, result) {
                    if (success) {
                        if(!result.includes(key)){
							blacklist[type][key].push(ID);
							localStorage.setItem('bangumi_result_blacklist',JSON.stringify(blacklist));
							$(elem).hide();
						}
                    }
                    else{
                        fetchList.push(elem);
                    }
                });
				fetchList.push(elem);
			}
            else count++;
        });
		let i = 0;
        let getitemsList= setInterval(function(){
            let elem = fetchList[i];
            if(elem){
                let href = elem.querySelector('a.subjectCover').href;
                getStatus(href,elem);
                i++;
            }
            if(count >= itemsList.length){
                clearInterval(getitemsList);
            }
        },300);
    }

    function getStatus(href,elem){
        let xhr = new XMLHttpRequest();
        xhr.open( "GET", href );
        xhr.withCredentials = true;
        xhr.responseType = "document";
        xhr.send();
        xhr.onload = function(){
            let d = xhr.responseXML;
            let ID = href.split('/subject/')[1];
            let tagList = d.querySelectorAll('#subject_detail .subject_tag_section .inner a.l');
            let tagsAll = {"tag":[],"vote":[]};
            for(let i=0;i<tagList.length;i++){
                tagsAll.tag.push(tagList[i].querySelector('span').textContent);
                tagsAll.vote.push(tagList[i].querySelector('small').textContent);
            }
            let Tags = [];
            for(let i=0;i<tagsAll.tag.length;i++){
                if(checkTag(tagsAll.tag[i]) && parseInt(tagsAll.vote[i])>= Math.min(10,parseInt(tagsAll.vote[0])/10))
                    Tags.push(tagsAll.tag[i]);
            }
			Tags = Tags.slice(0,Math.min(10,Tags.length));
            console.log('check '+ID+':'+Tags);
            setCache(ID,Tags);
			let TagsN = Tags;
			if(hotTags.includes(key)){
				TagsN = Tags.slice(0,5);
			}
            if(!TagsN.includes(key)){
                blacklist[type][key].push(ID);
                localStorage.setItem('bangumi_result_blacklist',JSON.stringify(blacklist));
                $(elem).hide();
            }
            count++;
        }
    }

	function checkTag(Tag){
        function parseDate(Datestring){
            let yy=Datestring.match(/(\d{4})/)? Datestring.match(/(\d{4})/)[1].toString():'';
            let year = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[1].toString(): yy;
            let month = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[3].toString(): '';
            let day = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)?Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[5].toString(): '';
            let time = year? (month? (year+'/'+month+'/'+day):year):'';
            return time;
        }
        if(!Tag) return false;
        else if(parseDate(Tag)!='') return false;
        else return true;
    }

    //设置
    if(document.location.href.match(/settings/)){
        $("#header > ul").append('<li><a id="blacklist" href="javascript:void(0);"><span>blacklist</span></a></li>');
        $("#blacklist").on("click", function() {
            $("#header").find("[class='selected']").removeClass("selected");
            $("#blacklist").addClass("selected");
            let data= localStorage.getItem('bangumi_result_blacklist');
            let  html = '<form>' +
                '<span class="text">以下是你所保存的搜索结果过滤黑名单，你可以编辑和替换，点击"确定"即可保存修改</span>'+
                '<textarea id="data_content" name="content" cols="45" rows="15" style="width: 1000px;" class="quick">'+data+'</textarea>'+
                '<input id="submitBtn" class="inputBtn" value="确定" readonly unselectable="on" style="width:26px">' +
                '<a id="alert_submit" style="color: #F09199; font-size: 14px; padding: 20px"></a>'+
                '</form>';
            $("#columnA").html(html);
            $("#submitBtn").on("click", function() {
                data = $("#data_content").attr("value");
                localStorage.setItem('bangumi_result_blacklist',data);
                alert('保存成功！');
            });
        });
    }
})();