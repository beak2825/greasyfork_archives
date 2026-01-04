// ==UserScript==
// @name 西瓜
// @namespace 西瓜
// @match http://zs.xiguaji.com/Member#/MArticle/Explore
// @grant none
// @description s
// @description:zh-cn
// @version 0.0.1.20180422153946
// @downloadURL https://update.greasyfork.org/scripts/40932/%E8%A5%BF%E7%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/40932/%E8%A5%BF%E7%93%9C.meta.js
// ==/UserScript==

bbqurl=new Array();
bbqbt=new Array();
bbqbt2=new Array();

biasdasdgre=setInterval(function (){
  if ($("#btnSearchBiz")[0].outerHTML){
    yemm();
    xmvi();
    $(document).ready(function(){  
      $("#kg").click(function(){  
        
        reasdb();
        
      });  
    }); 
    clearInterval(biasdasdgre);
  }
},1000); 



function yemm(){
  $("#btnSearchBiz")[0].outerHTML="<a id='btnSearchBiz' href='javascript:void(0);' class='control-search-public-submit'>搜公众号</a><a id='kg' class='control-search-public-submit'>开始</a>";
  

    $('#btnSearchBiz').click(function () {
        var keyword = $.trim($('#txtArticleKeyword').val());
        if (keyword == '')
            return;

        $(".material-tag .control-checkbox input").iCheck('uncheck');

        showLoading();

        var url = '/MArticle/SearchBiz?keyword=' + encodeURIComponent(keyword) + '&rnd=' + Math.random() * 1000;
        $.get(url, function (result) {
            hideLoading();
            if (result.replace(/(^\s*)|(\s*$)/g, "").length > 0) {
                $('#wrapSearchArticle').hide();
                $('#wrapAlert').hide();
                $('#wrapSearchBiz').show();
                $('#divBizResult').show();
                $('#divNoBizResult').hide();
                $('#btnLoadMoreBiz').html('加载更多...');
                $('#wrapSearchBizResult').html(result);
                BindBizSearchListEvent();
                p2 = 1;
            }
            else {
                $('#wrapSearchArticle').hide();
                $('#wrapSearchBiz').show();
                $('#divBizResult').hide();
                $('#divNoBizResult').show();
            }
        });
    })

}



function xmvi(){
	$(".material-tag input[disabled]").removeAttr("disabled");
    $(this).find("input").removeAttr("disabled");
    $("#SelectAll").click(function () {

        if ($("#SelectAll").html() == "反选")
        {
            $(".material-tag .control-checkbox input").iCheck('uncheck');
            $(".material-tag .control-checkbox input:first").iCheck('check');
            $("#SelectAll").html("全选");
            ReloadArticle();
            return;
        }

		$(".material-tag .control-checkbox input").iCheck('check');
		$("#SelectAll").html("反选");
		ReloadArticle();

    });

    $(".material-tag .control-checkbox").click(function () {
		var ipt = $(this).find("input");
		window.icheck = true;
		if(ipt.is(":checked")){
			ipt.iCheck('uncheck');
		}else{
			ipt.iCheck('check');
		}
		if (IsSearch) {
			$("#selPubHours button").removeClass("active");
			$("#selPubHours button:eq("+ getDefaultDayTagIndex() +")").addClass("active");
			IsSearch = false;
		}
		ReloadArticle();
    });
}


function reasdb(){
	reasd=$("#wrapSearchBizResult section div a");
	if (reasd.attr("href")){
		
		sac=$("#wrapSearchBizResult section div div  div  span  a");
		sac.each(function(i,dom){
		bbqurl[i]=dom.href;
		bbqbt[i]=dom.innerText;
		})
		
		
		func(bbqbt.length-1);

		sac.each(function(i,dom){
		dom.innerText=bbqbt2[i];
		})
		
		
	}	
}




function func(times){
    if(times <= -1){
        return;
    }
	bbqls="http://zs.xiguaji.com"+bbqurl[times].substr(bbqurl[times].indexOf("#")+1);
	console.log("递归次数："+times+";地址："+bbqls);
		$.ajax(  
			{  
			 
				url : bbqls,  
				type : "GET",  
				async:false,
				 
				success : function(data) 
					{                 
						bbq=data;

						substr1 = data.match(/<span>(\S*)预估活跃粉丝数/);
						substr1 = substr1.toString();
						substr1 = "		粉丝数:"+substr1.substr(6,substr1.indexOf("</")-6);

						
						substr2 = data.match(/<span>(\S*)公众号传播指数/);
						substr2 = substr2.toString();
						substr2 = "		传播数:"+substr2.substr(6,substr2.indexOf("</")-6);
						sbstr3 = substr1+substr2;
						console.log(sbstr3);
						bbqbt2[times] = bbqbt[times]+sbstr3;
						console.log(times);
					},  
				error : function()  
					{  
					console.log("请求错误");
					}  
			});
	times --;
	func(times); 
}

