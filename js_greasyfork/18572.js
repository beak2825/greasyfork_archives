// ==UserScript==
// @version        2016.04.15
// @name           Angies_List_Al_Tool_Plugin 1.81
// @namespace     AngiesListAlToolPlugin
// @author	      fengguan.ld~gmail。com
// @description    Feng Guan 对Angie's List AL Tool的BPO用户录入操作进行智能优化
// @include        https://altools.angieslist.com/Member/*
//在这写点什么备注信息呢？我还没想好！
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/18572/Angies_List_Al_Tool_Plugin%20181.user.js
// @updateURL https://update.greasyfork.org/scripts/18572/Angies_List_Al_Tool_Plugin%20181.meta.js
// ==/UserScript==
// 
var REQUEST_DELAY = 500; // milliseconds
var LINK_POSITION_OFFSET = 400; // number of pixels abover or below viewport to trigger link check
// remove the // on the next line to enable audio notification
var VOLUME = 0.1; // volume of chime

var audio;
var $preview_links;
var posts_dict = {};
var delay_counter = 0;

function mark_hit_post($link)
{
    $link.text($link.text().replace('[Page Request Rate Error] -- ', ''));
    GM_xmlhttpRequest(
    {
        method: "GET",
        url: $link.attr('href'),
        onerror: function()
        {
            delay_counter--;
            alert('mmmturkeybacon Ghost HIT Buster for Forums: Page request failed.');
        },
        onload: function (response)
        {
            delay_counter--;
            var $src = $(response.responseText);
            var id = $link.closest('div[id^="post_message_"], li[id^="post-"]').attr('id');
            var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
            if (maxpagerate.length == 0)
            {
                var is_a_HIT = $src.find('input[type="hidden"][name="isAccepted"]').length > 0;
                var not_qualified = $src.find('span[id="alertboxHeader"]:contains("Your Qualifications do not meet the requirements to preview HITs in this group.")').length > 0;
                var requester_results = $src.find('td[class="title_orange_text_bold"]:contains("HITs Created by")').length > 0;
                if (is_a_HIT)
                {
                    var hitAutoAppDelayInSeconds = $src.find('input[type="hidden"][name="hitAutoAppDelayInSeconds"]').val();
                    var num_available = $src.find('a[id="number_of_hits.tooltip"]').parent().next().text().trim();
        
                    // time formatting code modified from http://userscripts.org/scripts/show/169154
                    var days  = Math.floor((hitAutoAppDelayInSeconds/(60*60*24)));
                    var hours = Math.floor((hitAutoAppDelayInSeconds/(60*60)) % 24);
                    var mins  = Math.floor((hitAutoAppDelayInSeconds/60) % 60);
                    var secs  = hitAutoAppDelayInSeconds % 60;
            
                    var time_str = (days  == 0 ? '' : days  + (days  > 1 ? ' days '    : ' day '))    +
                                   (hours == 0 ? '' : hours + (hours > 1 ? ' hours '   : ' hour '))   + 
                                   (mins  == 0 ? '' : mins  + (mins  > 1 ? ' minutes ' : ' minute ')) + 
                                   (secs  == 0 ? '' : secs  + (secs  > 1 ? ' seconds ' : ' second '));

                    time_str = time_str.replace(/\s+$/, ''); 

                    if (hitAutoAppDelayInSeconds == 0)
                    {
                        time_str = "0 seconds";
                    }
                    $link.text('['+time_str+'|'+num_available+'] -- ' + $link.text());
                    posts_dict[id].link_cnt++;
                    posts_dict[id].strike_all_override = true;
                }
                else if (not_qualified)
                {
                    $link.text('[not qualified] -- ' + $link.text());
                }
                else if (!is_a_HIT && !requester_results)
                {
                    var $hit_container = $link.closest('table[class^="cms_table"], table[class^="ctaBbcodeTable"]');
                    if ($hit_container.length > 0)
                    {
                        $hit_container.css('text-decoration', 'line-through');
                        posts_dict[id].link_cnt++;
                    }
                    else
                    {
                        $link.css('text-decoration', 'line-through');
                        posts_dict[id].link_cnt++;
                        posts_dict[id].strike_all = true;
                    }
                }
            }
            else
            {
                $link.text('[Page Request Rate Error] -- ' + $link.text());
                posts_dict[id].link_cnt++;
                posts_dict[id].strike_all_override = true;
                $link.attr('mtbghbff_checked', 'false');
            }

            if ((posts_dict[id].strike_all_override == false) &&
                (posts_dict[id].strike_all == true) &&
                (posts_dict[id].link_cnt == posts_dict[id].num_links))
            {
                $link.closest('div[id^="'+id+'"], li[id^="'+id+'"]').css('text-decoration', 'line-through');
            }
        }
    });
}

function check_link_position()
{
    $preview_links.each(function()
    {
        var $link = $(this);
        if ($link.attr('mtbghbff_checked') != 'true')
        {
            var link_position = $link.offset().top;
            var top_of_viewport = $(window).scrollTop();
            var bottom_of_viewport = $(window).scrollTop() + $(window).height();

            if(top_of_viewport-LINK_POSITION_OFFSET < link_position && bottom_of_viewport+LINK_POSITION_OFFSET > link_position)
            {
                setTimeout(function(){mark_hit_post($link)}, REQUEST_DELAY*delay_counter);
                $link.attr('mtbghbff_checked', 'true');
                delay_counter++;
            }
        }
    }); 
}

function bustin_makes_me_feel_good()
{
    $preview_links = $('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")');

    if ($preview_links.length > 0)
    {
        var $hit_posts = $('div[id^="post_message_"], li[id^="post-"]').has('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")');

        $hit_posts.each(function()
        {
            var num_links = $(this).find('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")').length;
            posts_dict[$(this).attr('id')] = {num_links: num_links, link_cnt: 0, strike_all: false, strike_all_override: false};
        });

        if (typeof CHIME != 'undefined' && CHIME != '')
        {
            audio.play();
        }

        check_link_position();
    }
}

$(window).load(function()
{//每次刷新页面后都会添加plugbox
	 
		$("#slogan").before('<p id="plugbox" style="z-index: -100; width: 170px; height: 105px; position: fixed; color: royalblue; left: 2px; bottom: 0px; border: 2px solid #b5d4fe; margin: 10px 0 10px 0;"><img title="1.变大categories的checkbox啦; 2.我把Survey评分全都选A啦; 3.自动勾选Agree checkbox啦; 4.Review Origin自动选则MAIL-REVIEW PDF啦; 5. MAIN下拉消除多余的只留DATA TEAM啦; 6. 换行排版神马的最费指甲了点一下就帮你搞定啦; 7. Add Member的Signup Method自动选Non-Member Report啦; 8. Add Member的Source自动选Other啦; 9. 需要其他帮助请找Feng Guan;" src="data:image/gif;base64,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" width="160px" height="93px" style="margin:5px 5px 0 0;"/></p>');
	if ($("#plugbox").length==0){} 
	
	//到达Add a Review界面会自动点Service Provider按钮
	if ($("input[ID$='Step2Goto3']").length>0){ 
		$("input[ID$='Step2Goto3']").click();
		//$.cookie('RobotMsg', "."); 
		$("#plugmsg").html("已帮你猛点按钮穿越到下个页面啦");
	} 
	

	/**********************************************************************************************************/
	//以下是ADD A REVIEW页面的优化动作
	/**********************************************************************************************************/
	if($('select[ID$="ReportOriginDropDown"]').length>0){
		//$("#plugmsg").html("<br/>1.变大categories的checkbox.<br/>2.我把Survey评分全都选A啦<br/>3.自动勾选Agree checkbox啦 <br/>4.Review Origin自动选则MAIL - REVIEW PDF啦<br/>5.把俩个评论框瘦身后排排坐啦<br/><br/>* 需要其他帮助请找Feng Guan");
	}
	
	//增大categories的checkbox尺寸
	$('table.cblist [type=checkbox]').attr("style","width:16px;height:16px;").click(function(){
		if($(this).is(':checked')){
			$(this).next().addClass("table-cell-left");
		}
		else{			
			$(this).next().removeClass("table-cell-left");
		}
	});
	//如果一行里已经选了radio就不再替他选第一个radio了，但是实际测试，发现刷新页面后现有表单内容不保留，全部重置，radio全部变为未选中，所以这个判断暂时是多余的
	if($('table[ID$="GradableRadio"]').find("input[type=radio]:checked").length==0){ 
		$('table[ID$="GradableRadio"]').find("td:first").find("input[type=radio]").click();
		//$("#plugmsg").html($("#plugmsg").text()+" Survey评分全都选A啦.");
	}

	//自动选中more information的I confirm that the information contained in this Service Evaluation
	$(":checkbox[ID$=RptIAgree]").attr("checked","checked");
	
	//Review Origin: 下拉，默认选中MAIL - REVIEW PDF选项，此项的VALUE=49
	$('select[ID$="ReportOriginDropDown"]').find("option[value=49]").attr("selected","selected");
	
	//对俩评论文本框重新摆放，一左一右，因为原来一上一下的太费空间	
	//$("span[ID$=WorkDescLabel]").parent().wrap('<td id="tdWorkDescLabel" valign="top" style="height:200px;"></td>');
	//$("span[ID$=CommentLabel]").parent().wrap('<td id="tdCommentLabel" valign="top" style="height:200px;"></td>');
	//$("#tdWorkDescLabel").wrap('<table><tr id="trCommentLabel"></tr></table>');
	//$("#tdCommentLabel").insertAfter("#tdWorkDescLabel").find("br").remove();	
	//对俩评论文本框进行宽高瘦身
	$("div[ID$=ReportTextWorkDescriptionRadEditor]").css({"height":"150px","min-height":"220px","width":"450px"});
	$("table[ID$=ReportTextWorkDescriptionRadEditorWrapper]").css("height","120px");
	$("div[ID$=ReportTextCommentsRadEditor]").css({"height":"150px","min-height":"220px","width":"450px"});
	$("table[ID$=ReportTextCommentsRadEditorWrapper]").css("height","120px");
	$("span.exceptionlanguage").hide();
	$("span.exceptionlanguage").parent().attr("style",""); //You have 10000 characters remaining.取消居右显示
	
	//这个SPAN的文字太长，挤到右边的评论框，缩减文件，增加提示
	$("span[ID$=WorkDescLabel]").text("Please describe the reason for your appointment(10000 char remaining)").attr("title","Please describe the reason for your appointment, your interaction with the provider, and any treatment outcomes.");
	$("span[ID$=CommentLabel]").text("How'd it go? We want all the details.(10000 char remaining)");
	
	/**********************************************************************************************************/
	//以下是Add Notes页面的优化动作
	/**********************************************************************************************************/
	if($('select[ID$="MainNoteCategoryDropDown"]').length>0){ 
		//页面顶部右侧定距悬浮黄色固定大小的DIV，点击清理多余的SUB选项并将SUB的SIZE设为6让它直接展示出所有选项
			$('div[id$=NotesPanel] h2:first').html("小叮当推荐的姿势是：先填Note点一下，选完MAIN后，点清除垃圾就可以直选SUB咯！");
		$("a.LoginStatus").next().html($("a.LoginStatus").next().html()+$('span[id$=ServerNameLabel]').html());
			//$("#slogan").after('<div id="divBlastSub" style="width: 62px; height: 54px; position: absolute;right:260px; top: 140px; border: 2px solid #b5d4fe; margin:3px;background-color:yellow;color:darkred;font-size:24px;z-index: 9999;"></div>');

			$("#slogan").after('<a id="aClearSub" style="position: absolute;right:320px; top: 140px;z-index: 9999;" title="Save Changes" tabindex="6" class="VEALLinkButton" href="#"></a>');


			$('span[id$=ServerNameLabel]').html("展开SUB并清除垃圾").appendTo($("#aClearSub"));
			//点击黄色的CLEAR SUB DIV，自动清理SUB中的垃圾选项，并设SIZE=6将选项选拨直接展示
			$('span[id$=ServerNameLabel]').click(function(){
				ClearSUBTrashOptions();
			});


			//MAIN:自动清除其它无用的，只留下 DATA TEAM和默认项
			 $('select[ID$="MainNoteCategoryDropDown"] option').each(function (){
			   if( $(this).val()!="14"&& $(this).val()!="0"){  
				  $(this).remove(); 
				 //$("#charRemainingDiv").text($("#charRemainingDiv").text()+"|"+ $(this).val());
			   }  
			 });
			//直接显示出MainNoteCategoryDropDown的选项
			$('select[id$=MainNoteCategoryDropDown]').attr("size",2);

			//$('select[ID$="MainNoteCategoryDropDown"]').change(function(){
			//	$('select[ID$="SubNoteCategoryDropDown"]').after('<input id="subBomb" onclick="removeSubOptions()" type="button" value="bomb">');
			//});
	}
	
	

	function ClearSUBTrashOptions(){
		$('select[ID$="SubNoteCategoryDropDown"] option').each(function (){
				var skey=$(this).val();
				if(skey!="6580"&&skey!="5203"&&skey!="616"&&skey!="5199"&&skey!="5220"&&skey!="5211"){  
				$(this).remove(); 
				}  
			}); 
		$('select[ID$="SubNoteCategoryDropDown"]').attr("size",6);
		$('select[ID$="SubNoteCategoryDropDown"]').focus;
	}
	   //("select[ID$=SubNoteCategoryDropDown]").empty(); //用脚本附加的选项无法提交
		//$("select[ID$=SubNoteCategoryDropDown]").append('<option selected="selected" value="0">Select a Type</option>');  
		//$("select[ID$=SubNoteCategoryDropDown]").append('<option value="6580">Paper Report - Not Entered</option>'); 
		//$("select[ID$=SubNoteCategoryDropDown]").append('<option value="5203">Non-Member Report Entered - Paper</option>');  
		//$("select[ID$=SubNoteCategoryDropDown]").append('<option value="616">Send Info Created - Review Entered</option>');  
		//$("select[ID$=SubNoteCategoryDropDown]").append('<option value="5199">Send Info Created - Missing Report Info</option>');  
		//$("select[ID$=SubNoteCategoryDropDown]").append('<option value="5220">Free Member Created – Report Not Entered</option>');  
		//$("select[ID$=SubNoteCategoryDropDown]").append('<option value="5211">Free Member Created – Report Entered</option>');  

	//点击鼠标为NOTES textarea自动排版
	$("textarea[ID$=AddNoteTextBox]").click(function(){
		var txtnote=$.trim($("textarea[ID$=AddNoteTextBox]").val());
		txtnote = txtnote.replace(/[\r\n]/g," ")//去掉回车换行，多行变一行 
		if(txtnote!="" && txtnote.substr(0,23)!="Entered paper review on"){
			txtnote="Entered paper review on "+ txtnote; //起头加固定句式
		}			
		var juhao=txtnote.substr(txtnote.length-1,1);
		if(txtnote!="" && juhao!="."){ //末尾加句号
			txtnote=txtnote+".";
		}
		while (txtnote.indexOf("  ")>0) //去掉多位空格
	   {
			txtnote=txtnote.replace("  "," ");
	   }
		
		$("textarea[ID$=AddNoteTextBox]").val(txtnote);
	});

	/**********************************************************************************************************/
	//以下是Add a member 页面的优化动作
	/**********************************************************************************************************/
	$("#lcontentsalesCall").css("margin-left","220px");//往右让220给小叮当点地方啊
	//What is the Signup Method? 自动选择value=23的Non-member Report项
	$('select[ID$="SignupDropDown"]').find("option[value=23]").attr("selected","selected");
	 $('select[ID$="SignupDropDown"] option').each(function (){  
       var txt = $(this).text();  
       if(txt!="Non-Member Report"){  
          $(this).remove(); 
       }  
     });
	//Source自动选择value=7的Other项
	$('select[ID$="sourceDDList"]').find("option[value=7]").attr("selected","selected");
	$('select[ID$="sourceDDList"] option').each(function (){  
       var txt = $(this).text();  
       if(txt!="Other"){  
          $(this).remove(); 
       }  
     });
	//$(".VealColumnLabel,.dropdown,.button,input").css("font-size","16px");
   //$("#MemberInfoDiv").css("width","800px");

	 var observer = new MutationObserver(function(mutations, obs)
    {
        var new_links_available = false;
        for(var i = 0; i < mutations.length; i++)
        {
            for(var j = 0; j < mutations[i].addedNodes.length; j++)
            {
                var new_tag = mutations[i].addedNodes[j];
                if ($(new_tag).find('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")').length > 0)
                {
                    new_links_available = true;
                    break;
                }
            }
            if (new_links_available)
            {
                break;
            }
        }

        if (new_links_available)
        {
            bustin_makes_me_feel_good();
        }
    });

    observer.observe(document.documentElement,
    {
        childList: true,
        subtree: true
    });
});

