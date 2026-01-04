// ==UserScript==
// @name         373简化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  读取dom内容，生成更易读和交互的列表
// @author       You
// @match        https://www.dd373.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dd373.com
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443270/373%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443270/373%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let _db = [];
    //
GM_addStyle(`
#table-viewer{
  position: absolute;
  visibility: visible;
  top: 0px;
  left: 0px;
  background: white;
  border: gray 3px solid;
  z-index: 9999999999;
}
.table-viewer button{
  min-width: 30px;
}
.table-viewer-header{
  position: fixed;
}
.table-viewer-table-toolbar{
  position: fixed;
  margin-left: 50px;
}
.table-viewer-table{
  font-size: 18px;
  border-collapse: separate;
  border-spacing: 20px;
  padding-top: 20px;
}
.table-viewer-table tr{

}
.table-viewer-table td{
  display: list-item;
}
.table-viewer-table td.table-viewer-item-image_url{
  display: table-cell;
}
.table-viewer-table td.table-viewer-item-index{
  display: revert;
}
.table-viewer-item-image_url img{
  width: 300px;
}
.table-viewer-item-title{
}
.table-viewer-item-attr{
}
.table-viewer-item-price{
}
.table-viewer-item-kucun{
}
.table-viewer-item-qufu-attr{
}
.table-viewer-item-link{
}
.table-viewer-item-link a{
}
`)

    /////////////////////////
    let getDataFromDom = (function(){
        //
        function getImageFromDom(dom){
            var a = dom.querySelector(".game-image a")
            if(!a) return;
            var regMatchResult = a.style.backgroundImage?.match(/url\("(.*)_watermark.*"\)/)
            if(!regMatchResult) return;
            return "http:" + regMatchResult[1] + "_watermark";
        }
        function getTitleFromDom(dom){
            return dom.querySelector('.goods-list-title').innerText.trim()
        }
        function getPriceFromDom(dom){
            var priceText = dom.querySelector('.goods-price').innerText.trim().split('￥')[1]
            return Number(priceText);
        }
        function getKuCunFromDom(dom){
            var kucun = dom.querySelector('.kucun').innerText.trim();
            return Number(kucun);
        }
        function getAttrFromDom(dom){
            var attr = dom.querySelector('.goods-item-attr').innerText.trim();
            return attr;
        }
        function getQuFuAttrFromDom(dom){
            var attr = dom.querySelector('.game-qufu-value').innerText.trim();
            return attr;
        }
        function getLinkFromDom(dom){
            var link = dom.querySelector('.im-buy-btn').href;
            return link;
        }
        function getUploadTime(dom){
            var a = dom.querySelector(".game-image a")
            if(!a) return;
            var regMatchResult = a.style.backgroundImage.match(/.*Upload\/(\d{4}-\d{2}-\d{2}).*/)
            if(!regMatchResult) return "";
            return regMatchResult[1];
        }
        function getUpdateTime(dom){
            var link = dom.querySelector('.im-buy-btn').href;
            var m = link.match(/detail-DB(?<YYYY>\d{4})(?<MM>\d{2})(?<DD>\d{2})(?<hh>\d{2})(?<mm>\d{2})(?<ss>\d{2})-(?<id>\d+).html/)  //detail-DB20211117205045-20408.html
            if(!m || !m.groups) return "";
            var r = m.groups;
            return `${r.YYYY}-${r.MM}-${r.DD} ${r.hh}:${r.mm}:${r.ss}`;
        }
        function getOneItemDataFromDom(dom){
            var item = {};
            item.image_url = getImageFromDom(dom);
            item.title = getTitleFromDom(dom);
            item.attr = getAttrFromDom(dom);
            item.price = getPriceFromDom(dom);
            item.kucun = getKuCunFromDom(dom);
            item.qufu_attr = getQuFuAttrFromDom(dom);
            item.link = getLinkFromDom(dom);
            item.uploadTime = getUploadTime(dom);
            item.updateTime = getUpdateTime(dom);
            return item;
        }
        function getAllDataFromPage(){
            var allContainer = document.querySelectorAll(".goods-list-item");
            var allData = [];
            for(var i=0,len=allContainer.length; i<len; i++) {
                var item = getOneItemDataFromDom(allContainer[i]);
                allData.push(item);
            }
            return allData;
        }
        return getAllDataFromPage;
    })();
    function getUrlParams() {
        const paramsArray = window.location.search.substr(1).split('&');
        const params = {};

        for (let i = 0; i < paramsArray.length; ++i) {
            let param = paramsArray[i].split('=', 2);

            if (param.length !== 2) continue;

            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, ' '));
        }

        return params;
    }
    function getKeywordsFromURL(){
        const params = getUrlParams();
        return params['KeyWord'];
    }
    /////////////////////////
    let _DATA = [];
    let _last_view_data = [];
    let _searchKeywords = getKeywordsFromURL();
    let _FILTERS = {
        'default_skip_seokeywords': function(data){
            var new_data = [];
            var filtedNum = 0;
            for(var i=0,len=data.length;i<len;i++){
                var title = data[i].title;
                var splitArr = title.split('关联');
                if(splitArr.length>1){
                    title = splitArr[0];
                    if(title.indexOf(_searchKeywords)<0){
                        filtedNum ++;
                        continue;
                    }
                    data[i].title = title;
                }
                var splitArr2 = title.split('无限 谜团');
                if(splitArr2.length==1){
                    splitArr2 = title.split('无限谜团');
                }
                if(splitArr2.length>1){
                    title = splitArr2[0];
                    if(title.indexOf(_searchKeywords)<0){
                        filtedNum ++;
                        continue;
                    }
                    data[i].title = title;
                }
                new_data.push(data[i]);
            }
            if(filtedNum>0){
               alert('成功过滤掉 ' + filtedNum + ' 个seo干扰商品');
            }
            return new_data;
        }
    };
    function insertDataToViewerContainer(data, filter){
        if(filter){
            data = filter(data);
        }
        var table = document.getElementById('table-viewer-table');
        var content = '';
        for(var i=0,len=data.length; i<len; i++) {
            var item = data[i];
            var tr = `
            <tr>
              <td class="table-viewer-item-index">${i+1}/${len}</td>
              <td class="table-viewer-item-image_url"><img src="${item.image_url}"/></td>
              <td class="table-viewer-item-title red" style="color:red;font-size:22px">${item.title}</td>
              <td class="table-viewer-item-price red" style="color:red;font-size:24px">${item.price}</td>
              <td class="table-viewer-item-link blue" style="color:blue"><a href="${item.link}">购买链接</a></td>
              <td class="table-viewer-item-kucun" style="color:black">库存：${item.kucun}</td>
              <td class="table-viewer-item-attr grey" style="color:grey">上传时间：${item.uploadTime}</td>
              <td class="table-viewer-item-attr grey" style="color:grey">更新时间：${item.updateTime}</td>
              <td class="table-viewer-item-attr grey" style="color:grey">类型：${item.attr}</td>
              <td class="table-viewer-item-qufu-attr" style="color:grey">${item.qufu_attr}</td>
            </tr>
            `
            content += tr;
        }
        table.innerHTML = content;
        _last_view_data = data;
    }
    function useFilter(filter){
        insertDataToViewerContainer(_last_view_data, filter);
    }
    function arrangeByPrice(arrange){
        var data = _DATA.concat();
        data.sort(function(s1, s2){
            if(arrange=='asc') return s1.price - s2.price;
            else if(arrange=='desc') return s2.price - s1.price;
        });
        insertDataToViewerContainer(data);
    }
    function arrangeByUploadTime(arrange){
        var data = _DATA.concat();
        data.sort(function(t1, t2){
            var s1 = new Date(t1.uploadTime)
            var s2 = new Date(t2.uploadTime)
            if(arrange=='asc') return s1 - s2;
            else if(arrange=='desc') return s2 - s1;
        });
        insertDataToViewerContainer(data);
    }
    function arrangeByUpdateTime(arrange){
        var data = _DATA.concat();
        data.sort(function(t1, t2){
            var s1 = new Date(t1.updateTime)
            var s2 = new Date(t2.updateTime)
            if(arrange=='asc') return s1 - s2;
            else if(arrange=='desc') return s2 - s1;
        });
        insertDataToViewerContainer(data);
    }
    function arrangeOrigin(arrange){
        var data = _DATA.concat();
        insertDataToViewerContainer(data);
    }
    function getViewerContainer(){
        var viewer = document.getElementById('table-viewer');
        if(!viewer){
            viewer = document.body.appendChild(document.createElement('div'))
            viewer.setAttribute('id', 'table-viewer');
            viewer.setAttribute('class', 'table-viewer');
            viewer.innerHTML = `
            <div class="table-viewer-header"><button id="table-viewer-toggle">-</button></div>
            <div class="table-viewer-content" id="table-viewer-content">
              <div class="table-viewer-table-toolbar" id="table-viewer-table-toolbar">
                <button id="table-viewer-arrange-by-price" data-arrange="asc">↑按价格升序</button>
                <button id="table-viewer-arrange-by-uploadTime" data-arrange="asc">↑按上传时间升序</button>
                <button id="table-viewer-arrange-by-updateTime" data-arrange="asc">↑按更新时间升序</button>
                <button id="table-viewer-arrange-origin">按原始排序</button>
                <button id="table-viewer-filter-1" data-filter='default_skip_seokeywords'>过滤器:seokeywords</button>
              </div>
              <table class="table-viewer-table" id="table-viewer-table">
              </table>
            </div>
            `
        }
        //
        var toggleBtn = document.getElementById('table-viewer-toggle');
        toggleBtn.addEventListener('click',function(){
            var content = document.getElementById('table-viewer-content');
            if(content.style.display=='none'){
                toggleBtn.innerHTML = '-';
                content.style.display = '';
                document.body.style.visibility = "hidden";
            }
            else{
                toggleBtn.innerHTML = '+';
                content.style.display = 'none';
                document.body.style.visibility = "visible";
            }
        });
        //
        var arrangeByPriceBtn = document.getElementById('table-viewer-arrange-by-price');
        arrangeByPriceBtn.addEventListener('click',function(){
            arrangeByPrice(arrangeByPriceBtn.dataset.arrange);
            if(arrangeByPriceBtn.dataset.arrange=='asc'){
                arrangeByPriceBtn.innerHTML = '↓按价格降序';
                arrangeByPriceBtn.dataset.arrange='desc';
            }
            else{
                arrangeByPriceBtn.innerHTML = '↑按价格升序';
                arrangeByPriceBtn.dataset.arrange='asc';
            }
        });
        //
        var arrangeByUploadTimeBtn = document.getElementById('table-viewer-arrange-by-uploadTime');
        arrangeByUploadTimeBtn.addEventListener('click',function(){
            arrangeByUploadTime(arrangeByUploadTimeBtn.dataset.arrange);
            if(arrangeByUploadTimeBtn.dataset.arrange=='asc'){
                arrangeByUploadTimeBtn.innerHTML = '↓按上传时间降序';
                arrangeByUploadTimeBtn.dataset.arrange='desc';
            }
            else{
                arrangeByUploadTimeBtn.innerHTML = '↑按上传时间升序';
                arrangeByUploadTimeBtn.dataset.arrange='asc';
            }
        });
        //
        var arrangeByUpdateTimeBtn = document.getElementById('table-viewer-arrange-by-updateTime');
        arrangeByUpdateTimeBtn.addEventListener('click',function(){
            arrangeByUpdateTime(arrangeByUpdateTimeBtn.dataset.arrange);
            if(arrangeByUpdateTimeBtn.dataset.arrange=='asc'){
                arrangeByUpdateTimeBtn.innerHTML = '↓按更新时间降序';
                arrangeByUpdateTimeBtn.dataset.arrange='desc';
            }
            else{
                arrangeByUpdateTimeBtn.innerHTML = '↑按更新时间升序';
                arrangeByUpdateTimeBtn.dataset.arrange='asc';
            }
        });
        //
        var arrangeOriginBtn = document.getElementById('table-viewer-arrange-origin');
        arrangeOriginBtn.addEventListener('click',function(){
            arrangeOrigin();
        });
        //
        var tableViewerTableToolbar = document.getElementById('table-viewer-table-toolbar');
        tableViewerTableToolbar.addEventListener('click',function(e){
            var target = e.target;
            if(target.tagName.toLowerCase()=='button'){
                var filter = target.dataset.filter;
                if(filter){
                    if(_FILTERS[filter]){
                        useFilter(_FILTERS[filter]);
                    }
                }
            }
        });
        return viewer;
    }
    function doJianHua(){
        _DATA = getDataFromDom();
        alert(`找到${_DATA.length}条数据.正在插入数据表...`);
        var tableViewer = getViewerContainer();
        insertDataToViewerContainer(_DATA);
        document.body.style.visibility = "hidden";
    }
    let id=GM_registerMenuCommand ("立即简化", function(){
        doJianHua()
    },null);
})();