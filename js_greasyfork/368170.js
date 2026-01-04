// ==UserScript==
// @name         Gongshang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抓取工商信息
// @author       MinWang
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @match        http://www.gsxt.gov.cn/*
// @downloadURL https://update.greasyfork.org/scripts/368170/Gongshang.user.js
// @updateURL https://update.greasyfork.org/scripts/368170/Gongshang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function trim(s){
       if(!s)return '';
       return s.replace(/[\t\n\r\u3000\s]*/g, '');
    }

    function downloadFile(fileName, content){
        var $aLink = $('<a id="download">下载</a>');
        $aLink.attr('download',  fileName);
        $aLink.attr('href',  "data:text/plain," + JSON.stringify(content));
        console.log('Append alink');
        $('div.companyName').append($aLink);
    }


    function getGongShang(){
       var $div = $('#primaryInfo');
       var json = {'企业名称':'',
	  	          '登记信息':{
	  	                    '单位名称':'',
	  	                    '登记证号':'',
	  	                    '法定代表人':'',
	  	                    '（工商登记）住所':'',
	  	                    '（工商登记）设立日期':'',
	  	                    '单位状态':''},
	  	          '详细信息':{'省工商局':{'企业设立登记信息':[{'企业名称':'',
	  	          	                                           '工商注册号':'',
	  	          	                                           '法定代表人姓名':'',
	  	          	                                           '企业类型名称': '',
	  	          	                                           '注册资本':'',
	  	          	                                           '资金币种':'人民币',
	  	          	                                           '经营范围':'',
	  	          	                                           '经营场所':'',
	  	          	                                           '企业住所':'',
	  	          	                                           '工商登记机关名称':'',
	  	          	                                           '设立日期':'',
	  	          	                                           '（变更）核准日期':'',
	  	          	                                           '营业期限至':''
	  	          	                                         }]}
	  	          	         }
	  	         };
       $div.find('dt.item,.item_right').each(function(i,e){
           //console.log(i);
           var $e = $(e);
           var key = trim($e.text()).replace(/：$/g, '');
           var $val = $e.next();
           var val = trim($val.text());

           switch(key){
               case '企业名称':
                   json['企业名称'] = val;
                   json['登记信息']['单位名称'] = val;
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['企业名称']= val;
                   break;
               case '统一社会信用代码':
                   json['登记信息']['登记证号'] = val;
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['工商注册号']= val;
                   break;
               case '法定代表人':
                   json['登记信息']['法定代表人'] = val;
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['法定代表人姓名']= val;
                   break;
               case '类型':
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['企业类型名称']= val;
                   break;
               case '注册资本':
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['注册资本']= val;
                   if(!val.lastIndexOf('人民币') && !val.lastIndexOf('万') || !val.lastIndexOf('万元')){
                      console.log('注册资本');
                   }else{
                      var zjbzs = /元(.+)$/.exec(val);
                      if(!zjbzs) zjbzs = /\d+(.+)$/.exec(val);
                      if(zjbzs && zjbzs[1]) json['详细信息']['省工商局']['企业设立登记信息'][0]['资金币种'] = zjbzs[1];
                   }
                   break;
               case '成立日期':
                   json['登记信息']['（工商登记）设立日期'] = val;
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['设立日期']= val;
                   break;
               case '营业期限至':
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['营业期限至']= val;
                   break;
               case '核准日期':
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['（变更）核准日期']= val;
                   break;
               case '登记机关':
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['工商登记机关名称']= val;
                   break;
               case '登记状态':
                   json['登记信息']['单位状态'] = val;
                   break;
               case '住所':
                   json['登记信息']['（工商登记）住所'] = val;
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['企业住所']= val;
                   break;
               case '经营范围':
                   json['详细信息']['省工商局']['企业设立登记信息'][0]['经营范围']= val;
                   break;
           }
       });
       return json;
    }

    var json= getGongShang();
    console.log(json);
    downloadFile(json['企业名称']+'.json', json);
})();