// ==UserScript==
// @name         lagouhelper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  拉勾自定义标记
// @author       hujun
// @match        https://www.lagou.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/29991/lagouhelper.user.js
// @updateURL https://update.greasyfork.org/scripts/29991/lagouhelper.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var companySelector='div[class^="company-name"]';
var pageSelector='li[class^="lg-pagination-"]';

var cookieHelper={
    getCookie:function(c_name)
    {
        if (document.cookie.length>0)
        {
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1;
                var c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    },
    setCookie:function(c_name,value,expiredays)
    {
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+
            ((expiredays===null) ? "" : ";expires="+exdate.toGMTString());
    }
};


var markHelper={
    markJsonObject:cookieHelper.getCookie('lagouhelperusermark')?JSON.parse(cookieHelper.getCookie('lagouhelperusermark')):{},
    getMark:function(company){
        var remarkDict=markHelper.markJsonObject;
        if(remarkDict[company]){
            return {
                Company:company,
                Remark:remarkDict[company]
            };
        }
        for(var item in remarkDict){
            if(company.indexOf(item)!=-1){
                return {
                    Company:item,
                    Remark:remarkDict[item]
                };
            }
        }
        return null;
    },
    removeMark:function(oldCompany){
        if(oldCompany){
            delete markHelper.markJsonObject[oldCompany];
        }
        //保存到cookie
        cookieHelper.setCookie('lagouhelperusermark',JSON.stringify(markHelper.markJsonObject),365*10);
    },
    saveMark:function(oldCompany,newCompany,remark){
        if(oldCompany){
            delete markHelper.markJsonObject[oldCompany];
        }
        markHelper.markJsonObject[newCompany]=remark;
        //保存到cookie
        cookieHelper.setCookie('lagouhelperusermark',JSON.stringify(markHelper.markJsonObject),365*10);
    }
};

/*
 * 检查公司名称是否被标记
 */
function checkCompany(){
    $(companySelector).each(function(){
//         var company=$(this).find('a').text();
//         //console.log('company:'+company);
//         $(this).append('<i><img src="https://resource.iphonexsr.com/images/Note.png" width="24" alt="标记" title="标记" class="lagouhelper_mark" style="cursor:pointer;"/></i>');
//         var mark=markHelper.getMark(company);
//         if(mark){
//             $(this).append('<i class="lagouhelper_remark"><font color="red">'+mark.Remark+'</font></i>');
//         }
        //console.log($(this).parent().parent().parent().find('.logouhelper_div').length);
        if($(this).parent().parent().parent().find('.logouhelper_div').length==0){
        addRemarkHtml($(this));
        }
    });
    setTimeout(function(){
        checkCompany();
    },3000);
}


/*
 * 刷新备注
 */
function refreshRemark(){
    $(companySelector).each(function(){
//         var company=$(this).find('a').text();
//         var mark=markHelper.getMark(company);
//         $(this).find('.lagouhelper_remark').remove();
//         if(mark){
//             $(this).append('<i class="lagouhelper_remark"><font color="red">'+mark.Remark+'</font></i>');
//         }
        $(this).parent().parent().parent().find('.logouhelper_div').remove();
        addRemarkHtml($(this));
    });
}

//添加备注html
function addRemarkHtml($company){
    var company=$company.find('a').text();
    //console.log('company:'+company);
    var html='';
    html+='<div class="logouhelper_div" style="margin-left: 500px;">';
    html+='<i><img src="https://resource.iphonexsr.com/images/Note.png" data-company="'+company+'" width="24" alt="标记" title="标记" class="lagouhelper_mark" style="cursor:pointer;"/></i>';
    var mark=markHelper.getMark(company);
    if(mark){
        html+='<i class="lagouhelper_remark"><font style="color:red">'+mark.Remark+'</font></i>';
    }
    html+='</div>';
    $company.parent().parent().after(html);
}


$(function(){
    //checkCompany();
    var wait=3000;
    setTimeout(function(){
        checkCompany();
        },wait);
    //点击“标记”图标弹出编辑框
    $(document).on('click','.lagouhelper_mark',function(event){
        //var $company_name=$(this).closest('.company_name');
        //var $company_name=$(this).parent().parent();
        var lagoucompany=$(this).attr('data-company');
        var mark=markHelper.getMark(lagoucompany);
        var popupHtml='<div id="lagouhelper_popup_edit" style="width:400px;height:200px;background-color:white;z-index:9999;position:fixed;top:40%;left:40%;border:6px solid rgba(0,0,0,.3);border-radius:5px;box-shadow:none;text-align:center;font-size:16px;">'
        +'<div style="margin-top:50px;"><label>公司关键词：</label><input class="lagouhelper_company" type="text" style="width:250px;height:30px;font-size:16px;" value="'+(mark?mark.Company:lagoucompany)
        +'" data-oldcompany="'+(mark?mark.Company:'')+'"/></div>'
        +'<div style="margin:10px 0 0 48px;"><label>备注：</label><input class="lagouhelper_remark" type="text" style="width:250px;height:30px;font-size:16px;" value="'+(mark?mark.Remark:'')+'"/></div>'
        +'<div style="margin-top:10px;"><input type="button" value="保存" class="lagouhelper_btn_save" style="background-color:#00b38a;color:#fff;width:60px;height:35px;margin:0 5px;font-size:16px;"／>'
        +'<input type="button" value="取消" class="lagouhelper_btn_cancel" style="background-color:#00b38a;color:#fff;width:60px;height:35px;margin:0 5px;font-size:16px;"／></div></div>';
        $('body').append(popupHtml);
    })
    //保存备注
    .on('click','.lagouhelper_btn_save',function(){
        var $lagouhelperPopupEdit=$('#lagouhelper_popup_edit');
        var oldCompany=$lagouhelperPopupEdit.find('.lagouhelper_company').attr('data-oldcompany');
        var newCompany=$lagouhelperPopupEdit.find('.lagouhelper_company').val().trim();
        var remark=$lagouhelperPopupEdit.find('.lagouhelper_remark').val().trim();
        //检查输入是否规范
        if(!newCompany){
            alert('公司关键词不能为空或空格');
            return;
        }
        if(!remark){
            markHelper.removeMark(oldCompany);
            markHelper.removeMark(newCompany);
        }
        else{
            markHelper.saveMark(oldCompany,newCompany,remark);
        }
        $('#lagouhelper_popup_edit').remove();
        refreshRemark();
    })
    .on('click','.lagouhelper_btn_cancel',function(){
        $('#lagouhelper_popup_edit').remove();
    })
    .on('click',pageSelector,function(){
        setTimeout(function(){
        checkCompany();
        },wait);
    });
});
