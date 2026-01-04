// ==UserScript==
// @name        店小秘通用函数
// @namespace   Violentmonkey Scripts
// @license MIT
// @icon        https://www.dianxiaomi.com/favicon.ico
// @grant GM_xmlhttpRequest
// @version     0.0.4.2
// @author      KuromiNote
// ==UserScript==
const tool = {
    getTotalPage:async function(baseUrl,data=undefined,limtPage=-1,op='GET'){
      let book = [];
      if(!Object.keys(data).includes("pageNo")){
        return;
      }
      if(op.toUpperCase() === 'GET' && data){
        url = this.setUrlParam(baseUrl,data)
      }else{
        url = baseUrl;
      }
      var pageNo = +data['pageNo'];
      var firstPage = await new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: op,
          url: url,
          data:this.decodeData(data),
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          onload: function (response) {
            html = $(response.responseText);
            resolve(html);
          }
        });
      });
      book.push(firstPage);
      var tasks = [];
      var totalPage = firstPage.find("#totalPage");
      if(totalPage.length === 0){
        totalPage = firstPage.closest("#totalPage");
      }
      if(totalPage.length === 0){
        totalPage = firstPage.find("#totalPages");
      }
      if(totalPage.length === 0){
        totalPage = firstPage.closest("#totalPages");
      }
      totalPage = +totalPage.val();
      if (limtPage >= 0 && limtPage <= totalPage){
          totalPage = limtPage;
      }
      for(var i=pageNo+1;i<=totalPage;++i){
        data['pageNo'] = i;
        if(op.toUpperCase() === 'GET' && data){
            url = this.setUrlParam(baseUrl,data);
        }
        tasks.push(new Promise((resolve) => {
          GM_xmlhttpRequest({
            method: op,
            url: url,
            data:this.decodeData(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (response) {
              html = $(response.responseText);
              resolve(html);
            }
          });
        }));
      }
      book = book.concat(await Promise.all(tasks));
      return book;
    },
    setUrlParam: function(url, param){
      return url+"?"+this.decodeData(param);
    },
    decodeData: function(data){
        return $.map(Object.keys(data),function(val){return `${val}=${data[val]? data[val]:''}`}).join("&");
    }
}
