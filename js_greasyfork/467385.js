// ==UserScript==
// @name         scifinder
// @namespace    https://origin-scifinder.cas.org
// @version      2.7.0
// @description  获取的化学信息,用于科研学习研究.
// @author       sparrow
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @resource customCSS https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require      https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467385/scifinder.user.js
// @updateURL https://update.greasyfork.org/scripts/467385/scifinder.meta.js
// ==/UserScript==

(function() {
    'use strict';
     /*将以下的js脚本注入浏览器页面,实现页面元素点选,获取页面的css*/
    /* globals jQuery, $, waitForKeyElements */
    if($("#mainFrame").length>0){
       return false;
    }
    var css =GM_getResourceText("customCSS");
    GM_addStyle(css);
     /*创建页面的按钮*/
    var modal = '<div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content" style="width:800px;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">Scifinder数据</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary">提交数据</button></div></div><!-- /.modal-content --> </div><!-- /.modal --></div>'
    $("body").append(modal)
    $("body").append('<div style="position: absolute;;right: 0;top: 404px;width:40px;"> <button type="button" id ="kj_addon" class="btn btn-primary">菜单</button></div></iframe>')
    $("body").append('<div id ="login_btn" style="position: absolute;cursor: move;;right: -12px;top: 314px;"><button type="button" id ="kj_login" class="btn btn-primary">打开登陆窗口</button></div>')
    $('body').append('<div id="draggable" style="position: absolute;cursor: move;;right: 40px;top: 265px;width:220px;margin:20px 5px;"> </div></iframe>')

    var loginkey = localStorage.getItem("loginkey");
    console.log(loginkey)
    if(loginkey!=null){
        $('#draggable').html('<div id="kj_btns" ><button type="button"  style="background-color:#da4f49;color:white;height: 45px;padding: 6px;float:right;" id="kj_selected3" source="scifinder">scifinder查看基本信息</button><button type="button"  style="background-color:#da4f49;color:white;height: 45px;padding: 6px;float:right;" id="kj_selected4" source="scifinder">scifinder查看合成路线</button><button type="button"  style="background-color:#da4f49;color:white;height: 45px;padding: 6px;float:right;" id="kj_selected" source="scifinder">scifinder查看DOI的文献及物质</button><button type="button" style="background-color:#ee8d37;color:white;height: 45px;padding: 6px;float:right;" id="kj_selected1" source="scifinder-n">Scifinder-n查看基本信息</button><button type="button" style="background-color:#ee8d37;color:white;height: 45px;padding: 6px;float:right;" id="kj_selected2" source="scifinder-n">Scifinder-n查看合成路线</button><button type="button" style="background-color:#ee8d37;color:white;height: 45px;padding: 6px;float:right;" id="kj_selected5" source="scifinder-n">Scifinder-n查看DOI的文献及物质</button></div>')
        $('#login_btn').hide()

    }else{
      /*登陆模态框*/
    $('#kj_login').on("click",function(event){
        /*登陆组件*/
        var login = '<form><div class="form-group"><label for="username">用户名：</label><input type="text" class="form-control" id="username" placeholder="请输入用户名"></div><div class="form-group"><label for="password">密码：</label><input type="password" class="form-control" id="password" placeholder="请输入密码"></div></form><div id="loginMsg"></div>'
        var login_button = '<button type="button" class="btn btn-primary" id="loginBtn">登陆</button><button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>'

        $("div.modal-body").html(login)
        $("div.modal-footer").html(login_button)
        $('#myModal').modal("show")
    })

    }


     // 点击登陆按钮，发送 AJAX 请求进行登陆操作
    $(document).on('click', '#loginBtn', function() {
        var username = $("#username").val();
        var password = $("#password").val();
        /*$('#draggable').html('<button type="button"  style="background-color:#da4f49;color:white;height: 45px;padding: 6px;" id="kj_selected">查看DOI的文献及物质</button><button type="button" style="background-color:#da4f49;color:white;height: 45px;padding: 6px;" id="kj_selected1">查看Scifinder-n基本信息</button><button type="button" style="background-color:#da4f49;color:white;height: 45px;padding: 6px;" id="kj_selected2">查看Scifinder-n合成路线及文献</button>')*/
        $("#loginMsg").html("登陆成功。");
        $('#myModal').modal("hide")
        GM_xmlhttpRequest({
            url:"http://120.55.59.217:8001/login/access-token",
            method :"POST",
            data:JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-type": "application/json"
            },
            onload:function(response){
                console.log(response.responseText)
                var resp = JSON.parse(response.responseText)
                if(resp.token!=null){
                    var loginkey = localStorage.setItem("loginkey",resp.token);
                    $("#loginMsg").html("登陆成功。");
                    location.reload();

                }else{
                   alert('重新登陆')
                }
                
            }
        });

    })

    /*存储页面获取到的数据*/
    var data={}
    /*操作菜单显示出来*/
    $(document).on('click', '#kj_addon', function() {
        if($('#kj_btns').is(':hidden')){
         $("#kj_btns").show()
        }else{
        $("#kj_btns").hide()
        }


    })
    /*scifinder获取文献信息*/
    $(document).on('click', '#kj_selected', function() {
        $("div.modal-body").html('')
        var list=[]
        $('.substanceRN>a:nth-child(1)').each(function(){

         var cas = $(this).text()
         list.push(cas)
        })

        var list1=[]
        $('ol.citation li').each(function(){

            var citiation = $(this).text()
            list1.push(citiation)
        })
        var doi=""
        var Doi = $('div#sideBar div.toolBox>div.toolBoxBody>div').text()
        Doi = Doi.split('\n')
        console.log(Doi)
        for(var i=0;i<Doi.length;i++){
           if(Doi[i].indexOf("DOI")!=-1){
             doi=Doi[i].split('DOI:')[1]
           }
        }
       /* var doi = $('li.breadcrumb:nth-child(1)>span.label').text()
        if(doi.indexOf('Document ID')!=-1){
           doi=doi
        }else{
          doi=''
        }
        doi = doi?doi.replaceAll('Document ID','').trim():''*/
        var item={
           casno:list?list:[],
           citiations:list1?list1:[],
           doi:doi?doi.trim():""
        }

       console.log(item)
        if(item.doi){
           console.log(item)
           var ff = '<dl><dt>DOI:</dt><dd>'+item.doi+'</dd><dt>CASNO:</dt><dd>'+list.join("<br>")+'</dd><dt>Citiations:</dt><dd>'+list1.join("<br>")+'</dd></dl>'

           $("div.modal-body").html(ff)
           $("div.modal-footer").html('<button type="button" id="refer" class="btn btn-primary">提交数据</button>')

           $('#myModal').modal("show")
            /*------------------*/
            data=item
        }else{
             alert("确认是否为文献页面！")
        }

    })
    /*scifinder基本信息*/
    $(document).on('click', '#kj_selected3', function() {
        var source = $(this).attr('source')
        $("div.modal-body").html('')
        var list=[]
        $('div.otherNames ul li').each(function(){
            var name = $(this).text()
            list.push(name)
        })
        var MolecularWeight=''
        $('dl.keyProperties dt').each(function(){
            if($(this).text()=='Molecular Weight'){
                MolecularWeight = $('dl.keyProperties dd:first()').text()
                console.log(MolecularWeight)
            }
        })
        /*相关casno*/
        var relate_Cas=[]
        if($('div.imgMapWrapper>div>div[data-rn]').length>0){
           $('div.imgMapWrapper>div>div[data-rn]').each(function(){
               casno = $(this).attr('data-rn')
               relate_Cas.push(casno)
           })
        }else if($('.componentNumber').length>0){
           var re_cas = $('.componentNumber').text()
           casno = re_cas.match(/\d{2,}-\d{2}-\d/)[0]
           relate_Cas.push(casno)
        }
       console.log(relate_Cas)


        var molecularFormula=$('div.molecularFormula').text()
        var enname = $('div.indexName').text()
        /*同结构casno*/
        var result_cas = $('li span.label.current').text().trim()
        var casno = $('li.breadcrumb span.label:first()').text()
        var canonical = $('div.canonical> div.smiles-text').text()
        var isomeric = $('div.isomeric> div.smiles-text').text()
        casno = casno.match(/\d{2,}-\d{2}-\d/)
        casno = casno?casno[0]:""
        var item={
           casno:casno?casno.match(/\d{2,}-\d{2}-\d/)[0].trim():"",
           ename: enname,
           canonical:"",
           isomeric:"",
           result_cas:result_cas,
           related_cas :relate_Cas,
           enbm:list,
           molecularFormula:molecularFormula?molecularFormula:"",
           MolecularWeigh:MolecularWeight?MolecularWeight:"",
           source:source
        }

       console.log(item)
       if(item.casno && item.result_cas && item.ename){
           console.log(item)
           var ff = '<dl><dt>搜索CasNo:</dt><dd>'+item.casno+'</dd><dt>英文名:</dt><dd>'+item.ename+'</dd><dt>同结构CasNo:</dt><dd>'+item.result_cas+'</dd><dt>相关casno:</dt><dd>'+relate_Cas.join("<br>")+'</dd><dt>别名:</dt><dd>'+list.join("<br>")+'</dd><dt>molecularFormula:</dt><dd>'+item.molecularFormula+'</dd><dt>MolecularWeigh:</dt><dd>'+item.MolecularWeigh+'</dd><dt>canonical:</dt><dd>'+item.canonical+'</dd><dt>isomeric:</dt><dd>'+item.isomeric+'</dd></dl>'

           $("div.modal-body").html(ff)
           $("div.modal-footer").html('<button type="button" id="baseinfo" class="btn btn-primary">提交数据</button>')

           $('#myModal').modal("show")
           data=item

        }else{
            alert("确认是否为基本信息页面！")
        }

    })
     /*scifinder-n获取文献信息*/
    $(document).on('click', '#kj_selected5', function() {
        $("div.modal-body").html('')
        var list=[]
        $("div.substance-grid-tile.ng-star-inserted").each(function(){
            var role_value = $("span.substance-notes-role-value",this).text()
            var cas = $("div.substance-rn>a",this).text()
            if(role_value.indexOf("Synthetic Preparation")!=-1){
                list.push(cas+"P")
            }else{
                list.push(cas)
                 }
        })

        var wenxian = []
        $("ul.citations-info-list li").each(function(){
            var article = $(this).text()
            wenxian.push(article.trim())
        })
        var doi=""
        doi = $("a.doi-link").text()
        doi = doi?doi.toUpperCase():''
        var item={
           casno:list?list:[],
           citiations:wenxian?wenxian:[],
           doi:doi?doi.trim():""
        }

       console.log(item)
        if(item.doi){
           console.log(item)
           var ff = '<dl><dt>DOI:</dt><dd>'+item.doi+'</dd><dt>CASNO:</dt><dd>'+list.join("<br>")+'</dd><dt>Citiations:</dt><dd>'+wenxian.join("<br>")+'</dd></dl>'

           $("div.modal-body").html(ff)
           $("div.modal-footer").html('<button type="button" id="refer" class="btn btn-primary">提交数据</button>')

           $('#myModal').modal("show")
            /*------------------*/
            data=item
        }else{
             alert("确认是否为文献页面！")
        }

    })
    /*scifinder-n基本信息*/
    $(document).on('click', '#kj_selected1', function() {
        var source = $(this).attr('source')
        console.log(source)
        $("div.modal-body").html('')
        var list=[]
        $('ul.list-unstyled.list-striped li>span').each(function(){
            var name = $(this).text()
            list.push(name)
        })

        var enname = $('.substance-name.ng-star-inserted').text()
        /*同结构casno*/
        var result_cas = ""
        if($('.row.preferred-rn.ng-star-inserted a').length>0){
            result_cas = $('.row.preferred-rn.ng-star-inserted a').text().trim()
        }
        /*相关casno*/
        var relate_Cas=[]
        var relate_cas = ""
        if($('div.ng-star-inserted sf-multi-image-component p.small.sub-component.substance-rn.ng-star-inserted').length>0){
            $('div.ng-star-inserted sf-multi-image-component p.small.sub-component.substance-rn.ng-star-inserted').each(function(){
              relate_cas = $(this).text()
              relate_Cas.push(relate_cas)
            })
        }
        $('.row.substance-withoutSafsUri.ng-star-inserted a').each(function(){
             var cas = $(this).text()
             if(cas){
                 relate_Cas.push(cas)
             }
        })

        var casno = $('title').text()
        var canonical = $('div.canonical> div.smiles-text').text()
        var isomeric = $('div.isomeric> div.smiles-text').text()
        casno = casno.match(/\d{2,}-\d{2}-\d/)
        casno = casno?casno[0]:""
        var item={
           casno:casno.trim(),
           ename: enname,
           canonical:canonical?canonical:"",
           isomeric:isomeric?isomeric:"",
           result_cas:result_cas?result_cas:casno.trim(),
           related_cas:relate_Cas?relate_Cas:[],
           enbm:list,
           molecularFormula:"",
           MolecularWeigh:"",
           source:source
        }

       console.log(item)
        if(item.casno && item.result_cas && item.ename){
           console.log(item)
           var ff = '<dl><dt>搜索CasNo:</dt><dd>'+item.casno+'</dd><dt>英文名:</dt><dd>'+item.ename+'</dd><dt>同结构CasNo:</dt><dd>'+item.result_cas+'</dd><dt>相关casno:</dt><dd>'+relate_Cas.join("<br>")+'</dd><dt>别名:</dt><dd>'+list.join("<br>")+'</dd><dt>molecularFormula:</dt><dd>'+item.molecularFormula+'</dd><dt>MolecularWeigh:</dt><dd>'+item.MolecularWeigh+'</dd><dt>canonical:</dt><dd>'+item.canonical+'</dd><dt>isomeric:</dt><dd>'+item.isomeric+'</dd></dl>'

           $("div.modal-body").html(ff)
           $("div.modal-footer").html('<button type="button" id="baseinfo" class="btn btn-primary">提交数据</button>')

           $('#myModal').modal("show")
           data=item

        }else{
            alert("确认是否为基本信息页面！")
        }

    })
    /*scifinder合成路线及文献*/
    $(document).on('click', '#kj_selected4', function() {
      $("div.modal-body").html('')
      $('.dropdown-menu').remove()
      var list=[]
      var casno = $('li.breadcrumb span.label:first()').text()
      $('#listContent ol.results>li').each(function(){
          var patents=$('span.detailLinkWrapper a.patentPakLogo.patentPDFRelatedTriggerLink.noSaveOrdinal',this).text()
          console.log(patents)
          if(!patents){

              var rel=[]
              $('.resultContent>div.scheme>div>img',this).each(function(){
                  var name = $(this).attr('alt')

                  rel.push(name)

              })
              var step=[]
              $('table.rxnstages tr',this).each(function(){
                  var title = $(this).text()
                  step.push(title)

              })
              var title = $('dl.reference dt a[id]',this).text()
              var authors=$('dd.detailWho',this).text()
              var brief=$('dd.detailSource',this).text()
              var steps=$('.rxnNotes',this).text()
              steps = steps?steps.split('Steps:')[1].split(',')[0].trim():""
              var rate = $('.yield:last()',this).text()
              var dd = rel.join('')
              var cas_start = dd.split('->')[0].split('+')
              var cas_end = dd.split('->')[1].split('+')
              var item={
                  cas_start:cas_start,
                  cas_end:cas_end,
                  rate:rate,
                  relate:step,
                  title:title,
                  authors:authors,
                  breif:brief?brief.trim():"",
                  steps:steps,
                  casno:casno?casno.match(/\d{2,}-\d{2}-\d/)[0]:""
              }
              list.push(item)
              console.log(list)
          }

      })
        if(list.length>0){
            console.log(list)
            var content=''
            for(var j=0;j<list.length;j++){
                var ff = '<dl><dt>'+(j+1)+'.标题:</dt><dd>'+list[j].title+'</dd><dt>作者:</dt><dd>'+list[j].authors+'</dd><dt>简介:</dt><dd>'+list[j].breif+'</dd><dt>合成路线:</dt><dd>'+list[j].cas_start.join("+")+'->'+list[j].cas_end.join("+")+'</dd><dt>产率:</dt><dd>'+list[j].rate+'</dd><dt>步骤:</dt><dd>'+list[j].steps+'</dd><dt>实验步骤:</dt><dd>'+list[j].relate.join('<br>').trim()+'</dd></dl><br>'
                content+=ff
            }
            $("div.modal-body").html('<dt>CasNo:</dt><dd>'+list[0].casno+'</dd> <br>'+content)
            $("div.modal-footer").html('<button type="button" id="compose" class="btn btn-primary">提交数据</button>')
            $('#myModal').modal("show")

            data={"casno":list[0].casno,"compose":list}

        }else{
            alert("确认是否为合成路线页面！")
        }

    })

    /*scifinder-n合成路线及文献*/
    $(document).on('click', '#kj_selected2', function() {
       
        $("div.modal-body").html('')
        $('.dropdown-menu').remove()
        var list=[]
        var casno =$(".toolbar-title span[class]:last-child").text()
        var reg=new RegExp(/\d{2,}-\d{2}-\d/)
        casno = reg.exec(casno)
        if(casno){
            casno=casno[0].trim()
        }
        var binname = $(".selected-bin-name").first().text()
        if(binname=="Product"){
         $('sf-reaction-result-page .reaction-result-answers').each(function(index){

            var cas_start=[]
            $('.reaction-tile-reactant .rn-no-image.ng-star-inserted',this).each(function(){
                cas_start.push($(this).text().trim())
            })
            $('.reaction-tile-reactant img',this).each(function(){
                  var cas = $(this).attr("alt").trim()
                  cas_start.push(cas)
              })
            var cas_end=[]
            $('.reaction-tile-product .rn-no-image.ng-star-inserted',this).each(function(){
                  cas_end.push($(this).text().trim())
              })
              $('.reaction-tile-product img',this).each(function(){

                  var cas = $(this).attr("alt")
                  cas_end.push(cas)
              })
              if($("div.summary",this).length>0){
               $("div.summary",this).each(function(){
                    var patent = $("span.patent-pak-logo-container.logo-container",this).length
                    if(!patent){
                        var authors = $("span.authors-text",this).text().trim()
                        var title = $('h4>a',this).text().trim()
                        var breif=$(".bibliography",this).text().trim()
                        var steps=""
                        steps = $(".step-value.ng-star-inserted",this).text().trim()

                        var relate=[]
                        $('.summary-steps.ng-star-inserted div.summary-step.ng-star-inserted',this).each(function(){
                            $('div.summary-stage.ng-star-inserted',this).each(function(){
                                var step=$(this).text().trim()
                                relate.push(step)
                            })

                        })

                        var rate = $('span.yield-value.ng-star-inserted',this).text()
                        var item={title:title,authors:authors,breif:breif,cas_start:cas_start,cas_end:cas_end,relate:relate,rate:rate,casno:casno,steps:steps}
                        /*原材料不为空*/
                        if(cas_start.length>0){
                           list.push(item)
                        }
                        
                    }
              /*专利结束*/
                })
              }else{
                  /*合成路线另一个页面*/
                   var patent = $("span.patent-pak-logo-container.logo-container",this).length
                   if(!patent){
                      var authors = $("span.authors-text",this).text().trim()
                      var title = $('h4>a',this).text().trim()
                      var breif=$(".bibliography",this).text().trim()
                      var relate=[]
                      $('.summary-steps.ng-star-inserted div.summary-step.ng-star-inserted',this).each(function(){
                         $('div.summary-stage.ng-star-inserted',this).each(function(){
                            var step=$(this).text().trim()
                            relate.push(step)
                         })
                     })
                     var steps=""
                     steps = $(".step-text.ng-star-inserted>.step-value",this).text().trim()
                     var rate = $('.yield-value',this).text()
                     var item={title:title,authors:authors,breif:breif,cas_start:cas_start,cas_end:cas_end,relate:relate,rate:rate,casno:casno,steps:steps}
                     /*原材料不为空*/
                     if(cas_start.length>0){
                         list.push(item)
                     }
                   }

                 }
            })
        }else{
           alert("请先选择Product复选框！")
        }
        if(list.length>0){
            console.log(list)
            var content=''
            for(var j=0;j<list.length;j++){
                var ff = '<dl><dt>'+(j+1)+'.标题:</dt><dd>'+list[j].title+'</dd><dt>作者:</dt><dd>'+list[j].authors+'</dd><dt>简介:</dt><dd>'+list[j].breif+'</dd><dt>合成路线:</dt><dd>'+list[j].cas_start.join("+")+'->'+list[j].cas_end.join("+")+'</dd><dt>产率:</dt><dd>'+list[j].rate+'</dd><dt>步骤:</dt><dd>'+list[j].steps+'</dd><dt>实验步骤:</dt><dd>'+list[j].relate.join('<br>').trim()+'</dd></dl><br>'
                content+=ff
            }
            $("div.modal-body").html('<dt>CasNo:</dt><dd>'+list[0].casno+'</dd> <br>'+content)
            $("div.modal-footer").html('<button type="button" id="compose" class="btn btn-primary">提交数据</button>')
            $('#myModal').modal("show")

            data={"casno":list[0].casno,"compose":list}

        }else{
            alert("确认是否为合成路线页面！")
        }

    })
    /*相关文献及casno信息*/
    $(document).on('click', '#refer', function() {
        GM_xmlhttpRequest({
            url:"http://120.55.59.217:8001/references/",
            method :"POST",
            data:JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
                "token": loginkey
            },
            onload:function(response){
                console.log(response.responseText)
                var resp = JSON.parse(response.responseText)
                if(resp.code==400){
                    localStorage.removeItem('loginkey')
                    alert("请重新登录");
                }else{
                $("#loginMsg").html("发送成功。");
                alert("发送成功");}
            }
        });

    });
    /*接口结束*/
      /*基本信息*/
    $(document).on('click', '#baseinfo', function() {
        GM_xmlhttpRequest({
            url:"http://120.55.59.217:8001/info/",
            method :"POST",
            data:JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
                "token":loginkey
            },
            onload:function(response){
                console.log(response.responseText)
                var resp = JSON.parse(response.responseText)
                console.log(resp)
                if(resp.code==400){
                    localStorage.removeItem('loginkey')
                    alert("请重新登录");
                }else{
                $("#loginMsg").html("发送成功。");
                alert("发送成功");}
            }
        });
   
    });
    /*接口结束*/
    /*合成路线信息*/
    $(document).on('click', '#compose', function() {
        GM_xmlhttpRequest({
            url:"http://120.55.59.217:8001/composes/",
            method :"POST",
            data:JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
                "token": loginkey
            },
            onload:function(response){
                console.log(response.responseText)
                var resp = JSON.parse(response.responseText)
                if(resp.code==400){
                    localStorage.removeItem('loginkey')
                    alert("请重新登录");
                }else{
                $("#loginMsg").html("发送成功。");
                alert("发送成功");}
            }
        });
       
    });
    /*接口结束*/
    // Your code here...
})();