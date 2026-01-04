// ==UserScript==
// @name        B站国际版网页字幕下载&强制字幕中文
// @namespace   yt.ikp.bilitools
// @match       https://www.biliintl.com/en/play/*
// @match       https://www.bilibili.tv/en/play/*
// @grant       none
// @version     1.2
// @author      网上商务模式
// @description 2021/10/17 下午5:43:39
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/434032/B%E7%AB%99%E5%9B%BD%E9%99%85%E7%89%88%E7%BD%91%E9%A1%B5%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%BC%BA%E5%88%B6%E5%AD%97%E5%B9%95%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/434032/B%E7%AB%99%E5%9B%BD%E9%99%85%E7%89%88%E7%BD%91%E9%A1%B5%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%BC%BA%E5%88%B6%E5%AD%97%E5%B9%95%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==
(() =>{
  console.log("MSI Fcine Loaded.");
  
  XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
  Object.defineProperty(XMLHttpRequest.prototype, "open", {
      get: function() {
          return this._open;
      },
      set: function(f) {
          this._open = new Proxy(f, {
              apply: function(f, instance, fargs) {
                  let url1 = fargs[1];
                  if (url1 && (url1.startsWith("https://api.biliintl.com/intl/gateway/m/subtitle") || url1.startsWith("https://api.bilibili.tv/intl/gateway/m/subtitle"))) {
                    fargs[1] = url1.replace(/s_locale=(.+)/, "s_locale=zh_Hans");
                    listen.call(instance, ...fargs);
                    console.log("xhr modified");
                  }
                  return f.call(instance, ...fargs);
              }
          });
      }
  });
  XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.open;
  const listen = function(){
    this.addEventListener("load", function() {
      if (this.readyState === 4){
        let resJson = JSON.parse(this.responseText);
        addSubinfoArea(resJson);
      }
    });
  };
  const addSubinfoArea = function(resJson){
    //先检测有没有以前留下来的，如果有先删了
    let oldDiv = document.getElementById("__ikp_msi_fcine_ext");
    if (oldDiv) {
      oldDiv.parentElement.removeChild(oldDiv);
    }
    //添加新的
    let infoarea = document.querySelector("#app > div > div.layout-body.media-width > div > div.video-container__detail.lg > div.main-area.media-size__video-wrap > div.main-area__info");
    let extArea = document.createElement('div');
    extArea.id = "__ikp_msi_fcine_ext";
    
    let subtArea = document.createElement('div');
    subtArea.className = "_ext_subtArea";
    let subspan = document.createElement('span');
    if (resJson && resJson.data && resJson.data.subtitles) {
      subspan.innerHTML = "检测到字幕（单击下载）：";
      subtArea.appendChild(subspan);
      
      let sublistUl = document.createElement('ul');
      for(let si of resJson.data.subtitles){
          let sublistLi = document.createElement('li');
          sublistLi.innerHTML = si.title;
          sublistLi.dataset.key = si.key;
          sublistLi.dataset.id = si.id;
          sublistLi.dataset.url = si.url;
          sublistLi.onclick = downloadSub;
          sublistUl.appendChild(sublistLi);
      }
      subtArea.appendChild(sublistUl);
      
    }else{
      subspan.innerHTML = "未检测到字幕";
      subtArea.appendChild(subspan);
    }
    

    
    extArea.appendChild(subtArea);
    infoarea.parentNode.insertBefore(extArea, infoarea);
    
    let styleElement = document.createElement('style');
    styleElement.innerHTML=`
._ext_subtArea{
  color: #999;
  margin-top: 15px;
}
._ext_subtArea>span{
  display: inline;
}
._ext_subtArea>ul{
  display: inline;
}
._ext_subtArea>ul>li{
  display: inline;
  background-color: rgba(51,51,51,.6);
  padding: 6px 12px;
  margin: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all .2s;
  font-size: 14px;
}
._ext_subtArea>ul>li:hover{
  background-color: rgb(51,51,51);
}`;
    extArea.appendChild(styleElement);
  }
  const downloadSub = function(e) {
    let subName = e.target.innerText;
    let subUrl = e.target.dataset.url;
    let subId = e.target.dataset.id;
    let subKey = e.target.dataset.key;
    console.log(`开始下载字幕：${subName}: ${subUrl}`);
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', subUrl, true);
    xhr.send();
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4 && xhr.status === 200){
        let subData = JSON.parse(xhr.responseText);
        let title = `${document.title}_${subId}_${subKey}.srt`;
        downloadSrt(title, srtBuild(subData));
      }
    }
  }
  const timeFormat = function(s){
      let h = Math.floor(s / 3600);
      let m = Math.floor(s / 60 % 60);
      let lp = s % 60;
      let hS = h.toString().padStart(2, '0');
      let mS = m.toString().padStart(2, '0');
      let lpS = lp.toFixed(3);
      let secS = lp < 10 ? '0'+lpS : lpS;
      return `${hS}:${mS}:${secS}`;
  }
  const srtBuild = function(data){
      let res = "";
      for (let i in data.body){
          let idx = parseInt(i) + 1;
          let line = data.body[i];
          let fromStr = timeFormat(line.from);
          let toStr = timeFormat(line.to);
          res += `${idx}\r\n`;
          res += `${fromStr} --> ${toStr}\r\n`;
          res += `${line.content}\r\n\r\n`;
      }
      return res;
  }
  const downloadSrt = function(name, str){
      let b = new Blob([str], {type: 'text/plain'});
      let a = document.createElement('a');
      a.download = name;
      a.href = URL.createObjectURL(b);
      a.click();
      URL.revokeObjectURL(b);
  }
})();