// ==UserScript==
// @name        找学习资料大师[电子书搜索神器]支持豆瓣/鸠摩搜书
// @namespace   ilovexuexi
// @match       *://www.jiumodiary.com/*
// @match       *://m.douban.com/book/subject/*
// @match       *://book.douban.com/subject/*
// @match       *://www.forkdoc.com/Center/prev.asp
// @grant       GM_xmlhttpRequest 
// @connect     *
// @connect     *://*.886889.xyz
// @version     1.6
// @author      -
// @description 帮你找到你想要的学习资料，搜索到绝大部分的电子书，支持豆瓣电脑端/手机端，支持鸠摩搜书扩展搜索结果
// @require     https://cdn.staticfile.org/jquery/1.10.0/jquery.js
// @require     https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.10.0/dist/sweetalert2.all.min.js
// @icon        https://www.xuexi.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/423587/%E6%89%BE%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99%E5%A4%A7%E5%B8%88%5B%E7%94%B5%E5%AD%90%E4%B9%A6%E6%90%9C%E7%B4%A2%E7%A5%9E%E5%99%A8%5D%E6%94%AF%E6%8C%81%E8%B1%86%E7%93%A3%E9%B8%A0%E6%91%A9%E6%90%9C%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/423587/%E6%89%BE%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99%E5%A4%A7%E5%B8%88%5B%E7%94%B5%E5%AD%90%E4%B9%A6%E6%90%9C%E7%B4%A2%E7%A5%9E%E5%99%A8%5D%E6%94%AF%E6%8C%81%E8%B1%86%E7%93%A3%E9%B8%A0%E6%91%A9%E6%90%9C%E4%B9%A6.meta.js
// ==/UserScript==
(function() {
  var ver = '1.6';
 
  function tips(title,content,force=false){
 

    key = md5(content+ver);
    
    if(force == false){
      
      if(getStorage(key) != 'ok'){

        Swal.fire({
            title: title,
            width:'800px',
            html: content,
            allowOutsideClick:false,
            confirmButtonText: '关闭'
        });

      }  
    }else{
      
        Swal.fire({
            title: title,
            width:'800px',
            html: content,
            allowOutsideClick:false,
            confirmButtonText: '关闭'
        });
      
    }
    
    
    
    setStorage(key, 'ok');
    
  }
  function getStorage(key) {
      return localStorage.getItem(key)
  }

  function setStorage(key, value) {
      return localStorage.setItem(key, value)
  }
  
  function get_book_id(url) {
    let re = /\/subject\/(\d+)/g;
    let matches = re.exec(url);

    if (matches && matches.length > 1) {
      return parseInt(matches[1]);
    }
  }
  function getExt(fileName) {
    var fileExtension = fileName.split('.').pop().toUpperCase();
    return fileExtension;
  }

  function formatBytes($size) {
    $units = new Array(' B', ' KB', ' MB', ' GB', ' TB');
    for ($i = 0; $size >= 1024 && $i < 4; $i++) {
      $size /= 1024;
    }
    return $size.toFixed(2) + $units[$i];
  }
 
  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }
  
 
  
  $(document).on('click', '#addnew', function() {

 

    url = "https://ops.886889.xyz/addnew.php?ver=" + ver;
    
    //console.log($("#addnewform").serialize());

    GM_xmlhttpRequest({

      method: "POST",

      url: url,
      
      data :$("#addnewform").serialize(),

      headers: {

        "Referer": "https://www.baidu.com/"

      },

      onload: function(res) {
 
      console.log($("#addnewform").serialize());
        if (res.status == 200) {

          $res = $.parseJSON(res.response);
          
          console.log($res);
          
          if($res.status == 'success'){
            
            $('[name="md5"]').val('');
            //$('[name="name"]').val('');
            $('[name="ext"]').val('');
            
          }
          
          alert($res.msg);


        } else {

          alert('无响应');

        }
      }

    });

  });
  
  
  
  var urlstr = decodeURI(location.href);
  
  n = urlstr.search("//www.forkdoc.com/Center/prev.asp");
  
  
  if(n !== -1){
    
    $result = $.parseJSON($('body').html());
    
    if($result.type == 200){
      
      if(confirm('转存成功需要跳转到你的主页查看吗?')){
         
         window.location.href= "//www.forkdoc.com/Center/ownfiles.asp";

      }
      
    }else{
      
      alert('啊哦，转存失败了，自己看看错误代码吧，如果是未登录请重新登录后重试')
    }
    
  }else{
    
    GM_xmlhttpRequest({

      method: "POST",

      url: 'https://ops.886889.xyz/tips.php?ver='+ver,
      
      data :$("#addnewform").serialize(),

      headers: {

        "Referer": "https://www.baidu.com/"

      },

      onload: function(res) {
 
        if (res.status == 200) {

          $res = $.parseJSON(res.response);
          
          if($res.ver > ver){
            
            $message = '不能使用的版本，正在使用的版本为'+ver+'，已发布的最新版本为'+$res.ver+'。请尽快升级到最新版本。点击确定或取消均会跳转至最新的下载页面';
            
            if(confirm($message)){
              
              window.location.href=$res.update_url;
              
            }else{
              
              window.location.href=$res.update_url;

            }

            return false;
          }
          
          //console.log($res);
          
          if($res.status == 'success'){
            
             n = urlstr.search("//m.douban.com/book/subject/");

            if(n !== -1){
              
 
      
               $template = 

               '<div id="">'+
                 '<section data-reactroot="" class="sub-vendor">'+
                   '<span class="vendor-text" style="font-size:12px;color:white;">' + $res.msg + '</span>'+
                   '<span class="vendor-go-app"></span>'+
                 '</section>'+
              '</div>';

               $('#subject-rating-root').after($template);
             }else{
              tips($res.title,$res.msg,$res.force);
              
            }
            
            
            
            
            
            if($res.share == true){
              $('#share_tips').css('display','block');
              $('#addnewform').css('display','block');
              
            }

          }
          
        } else {

          console.log('无响应');

        }
      }

    });
  }
  ///手机版
  n = urlstr.search("//m.douban.com/book/subject/");
  
  if(n !== -1){
 
    
    id = get_book_id(urlstr);

    //console.log(id)

    $('#tips').remove();

    if (id != undefined) {
//       $name = $.trim($(".sub-detail").find('.sub-title').text());
//       var $insertHtml =
//         '<div class="gray_ad buyinfo" id="downinfo">' +
//         '<div class="buyinfo-printed" id="buyinfo-printed">' +
//         '<h2><span>在哪儿下载这本书</span>&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·</h2>' +
//            '<div class="" id="share_tips" style="display:none;">'+
//               '如果你在FK上传了这个文件，欢迎共享'+
//           '</div>'+
//           '<form id="addnewform" style="display:none;"><input type="hidden" name="id" value="'+id+'">'+
//           '<input type="text" name="md5" placeholder="输入文件md5">'+
//           '<input type="text" name="name"  value="'+$name+'" readonly="readonly">'+
//           '<select name="ext"><option value="">请选择……</option><option value="mobi">mobi</option><option value="epub">epub</option><option value="azw3">azw3</option><option value="pdf">pdf</option></select>'+
//           //'<div class="market-banner"><div class="actions"><a class="j buy-btn buy" ></a></div></div>'+
//           '<br><span class="rec"><a style="background-color: #F39300;color:#fff;" href="javascript:;" id="addnew" class="j lnk-sharing lnk-douban-sharing">补充</a></span><hr></form>'+
//         '<ul class="bs current-version-list" id="downlist">' +
//         '</ul>' +
//         '</div>' +
//         '</div>';

//       $("#subject-rating-root").before($insertHtml);
 
      $('.vendors-link-group').before('<div id="load"><h3 style="color:green;">加载中……</h3><img width="32" src="https://img3.doubanio.com/f/talion/326df52f00a7dd43b9d23e2bbc7b7d3de5b9fd9e/pics/card/loading_green.gif"></div>');


      url = "https://ops.886889.xyz/db.php?ver=" + ver + "&id=" + id;

      GM_xmlhttpRequest({

        method: "GET",

        url: url,

        headers: {

          "Referer": "https://www.baidu.com/"

        },
        
        onload: function(res) {
          
          console.log(res);

          $('#load').html('');

          if (res.status == 200) {

            $res = $.parseJSON(res.response);

            $search = $res.info;
            
            
            
            

            if ($res.status == 'error') {

              $('.vendors-link-group').before('<h3 style="color:red;">没有结果</h3>');

              return;
            }
            
            
            
            
            

            $.each($search, function(i, item) {

              $form =
                '<form name="input" action="https://www.forkdoc.com/Center/prev.asp" method="POST" target="_blank"  id="' + item['md5'] + '">' +
                '<input type="hidden" name="fileName" value="' + item['name'] + '">' +
                '<input type="hidden" name="md5" value="' + item['md5'] + '">' +
                '<input type="hidden" name="fileMd5" value="18566e6a5533048283348e9a3ee629fc">' +

                '</form>';
              
              $template = 
                
              '<div id="">'+
                '<section data-reactroot="" class="sub-vendor">'+
                  '<span class="vendor-text" style="font-size:12px;">' + item['name'] + '</span>'+
                  '<span class="vendor-go-app" onclick="document.getElementById(\'' + item['md5'] + '\').submit();return false;">转存（'+formatBytes(item['size']) +'）</span>'+
                '</section>'+
              '</div>';

              // $template = '<li>' +
              //   '<div class="cell price-btn-wrapper">' +
              //   '<div class="vendor-name"><a href="javascript:void(0);"><span>' + item['name'] + '</span></a></div>' +
              //   '<div class="cell impression_track_mod_buyinfo">' +
              //   '<div class="cell price-wrapper"><a href="javascript:void(0);"><span class="buylink-price ">' + formatBytes(item['size']) + '</span></a></div>' +
              //   '<div class="cell"><a onclick="document.getElementById(\'' + item['md5'] + '\').submit();return false;" class="buy-book-btn e-book-btn"><span>转存</span></a></div>' +
              //   '</div>' +
              //   '</div>' +
              //   '</li>';
              $('.vendors-link-group').before($template + $form);

            });

          } else {

            alert('无响应');

          }
        }

      });

    } 
    
  }
  
 
  
  
  
  
  
  n = urlstr.search("//book.douban.com/subject/");
  
  if(n !== -1){
    
    id = get_book_id(urlstr);

    //console.log(id)

    $('#dale_book_subject_top_right').remove();

    if (id != undefined) {
      $name = $("[property='v:itemreviewed']").text()+'-'+$.trim($('#info .pl:contains(作者)').next().text());
      var $insertHtml =
        '<div class="gray_ad buyinfo" id="downinfo">' +
        '<div class="buyinfo-printed" id="buyinfo-printed">' +
        '<h2><span>在哪儿下载这本书</span>&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·</h2>' +
           '<div class="" id="share_tips" style="display:none;">'+
              '如果你在FK上传了这个文件，欢迎共享'+
          '</div>'+
          '<form id="addnewform" style="display:none;"><input type="hidden" name="id" value="'+id+'">'+
          '<input type="text" name="md5" placeholder="输入文件md5">'+
          '<input type="text" name="name"  value="'+$name+'" readonly="readonly">'+
          '<select name="ext"><option value="">请选择……</option><option value="mobi">mobi</option><option value="epub">epub</option><option value="azw3">azw3</option><option value="pdf">pdf</option></select>'+
          //'<div class="market-banner"><div class="actions"><a class="j buy-btn buy" ></a></div></div>'+
          '<br><span class="rec"><a style="background-color: #F39300;color:#fff;" href="javascript:;" id="addnew" class="j lnk-sharing lnk-douban-sharing">补充</a></span><hr></form>'+
        '<ul class="bs current-version-list" id="downlist">' +
        '</ul>' +
        '</div>' +
        '</div>';

      $("#buyinfo").before($insertHtml);
 
      $('#downlist').append('<h3 style="color:green;">加载中……</h3><img src="https://www.jiumodiary.com/images/loading_bright.gif">');

      url = "https://ops.886889.xyz/db.php?ver=" + ver + "&id=" + id;

      GM_xmlhttpRequest({

        method: "GET",

        url: url,

        headers: {

          "Referer": "https://www.baidu.com/"

        },
        
        onload: function(res) {

          $('#downlist').html('');

          if (res.status == 200) {

            $res = $.parseJSON(res.response);

            $search = $res.info;

            if ($res.status == 'error') {

              $('#downlist').append('<h3 style="color:red;">没有结果</h3>');

              return;
            }

            $.each($search, function(i, item) {

              $form =
                '<form name="input" action="https://www.forkdoc.com/Center/prev.asp" method="POST" target="_blank"  id="' + item['md5'] + '">' +
                '<input type="hidden" name="fileName" value="' + item['name'] + '">' +
                '<input type="hidden" name="md5" value="' + item['md5'] + '">' +
                '<input type="hidden" name="fileMd5" value="18566e6a5533048283348e9a3ee629fc">' +

                '</form>';

              $template = '<li>' +
                '<div class="cell price-btn-wrapper">' +
                '<div class="vendor-name"><a href="javascript:void(0);"><span>' + item['name'] + '</span></a></div>' +
                '<div class="cell impression_track_mod_buyinfo">' +
                '<div class="cell price-wrapper"><a href="javascript:void(0);"><span class="buylink-price ">' + formatBytes(item['size']) + '</span></a></div>' +
                '<div class="cell"><a onclick="document.getElementById(\'' + item['md5'] + '\').submit();return false;" class="buy-book-btn e-book-btn"><span>转存</span></a></div>' +
                '</div>' +
                '</div>' +
                '</li>';
              $('#downlist').append($template + $form);

            });

          } else {

            alert('无响应');

          }
        }

      });

    } 
    
  }





  ///////////////////////jiumo



  $(document).on('click', '#SearchButton', function() {


    SearchWord = $('#SearchWord').val();

    url = "https://ops.886889.xyz/search.php?ver=" + ver + "&wd=" + SearchWord;

    GM_xmlhttpRequest({

      method: "GET",

      url: url,

      headers: {

        "Referer": "https://www.baidu.com/"

      },

      onload: function(res) {



        if (res.status == 200) {

          $res = $.parseJSON(res.response);

          $search = $res.info;

          //console.log($res)
          
          timer = setInterval(function() {

            if ($('#result-ul').find('.span-host').length >= 1) {

              if ($res.status == 'error') {

                $('#result-ul div:eq(0)').before('<h1 style="color:red;" class="zhuancun">没有结果</h1>');

                if ($('.zhuancun').length > 0) {
                  clearInterval(timer);
                }

                return;
              }

              $.each($search, function(i, item) {

                $form =
                  '<form name="input" action="https://www.forkdoc.com/Center/prev.asp" method="POST" target="_blank"  id="' + item['md5'] + '">' +
                  '<input type="hidden" name="fileName" value="' + item['name'] + '">' +
                  '<input type="hidden" name="md5" value="' + item['md5'] + '">' +
                  '<input type="hidden" name="fileMd5" value="18566e6a5533048283348e9a3ee629fc">' +

                  '</form>';

                $html =
                  '<div>' +
                  '<a style="cursor: pointer;" onclick="document.getElementById(\'' + item['md5'] + '\').submit();return false;">' +
                  '<span style="font-size: 18px; font-family: arial,sans-serif;">' + item['name'] + '<span></span></span>' +
                  '</a>' +
                  '</div>' +
                  '<div class="span-des">分享时间: ' + getNowFormatDate() + ', 文件大小: ' + formatBytes(item['size']) + ' </div>' +
                  '<div class="span-host" style="font-weight: bold; font-size: 13px;">ForkDoc' +
                  '<span style="margin-left: 10px;">' +
                  '<a onclick="document.getElementById(\'' + item['md5'] + '\').submit();return false;" style="cursor:pointer;color: grey;font-size: 12px;" class="zhuancun">转存</a>' +
                  '</span>' +
                  '</div>';
                $('#result-ul div:eq(0)').before($html + $form);

                $ext = getExt(item['name']);

                $dom = $('#' + $ext);


                if ($dom.length == 1) {

                  $count_text = $dom.text();

                  $strs = $count_text.split("(")[1];

                  $format_num = $strs.replace(')', ' ');

                  $format_num = parseInt($format_num) + 1;

                  $dom.text($ext + '(' + $format_num + ')')
                }

              });

              if ($('.zhuancun').length > 0) {
                clearInterval(timer);
              }

            } else {
              //console.log('不再执行');
              //clearInterval(timer);
            }
          }, 2000);


        } else {

          alert('无响应');

        }
      }

    });

  });
})();