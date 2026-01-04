// ==UserScript==
// @name         LoveListFilter for Booth.pm
// @name:ja-JP   「スキ！」タグ for Booth
// @namespace    https://greasyfork.org/ja/users/943247-piyoryyta
// @version      1.0.1
// @description  Add a feature to filter contents by tagging in the "Items Your Loved" page in booth.pm.
// @description:ja-JP  Boothの「スキ！」したアイテムをタグでフィルターできます。
// @author       piyoryyta
// @match        https://accounts.booth.pm/wish_lists*
// @icon         none
// @grant        none
// @require     https://code.jquery.com/jquery-1.12.4.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448995/LoveListFilter%20for%20Boothpm.user.js
// @updateURL https://update.greasyfork.org/scripts/448995/LoveListFilter%20for%20Boothpm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tag_categories;
    var tags;
	var currentHideMode = 1;
	const hideMode = {"transparent":0, "hide":1};

    //Add CSS
    const overrideCss = "body {background-color:#f1f5f8} .item-card__category {line-height: 1.8;}";
	const tagMenuCss = ".tagMenu {width: 944px; padding: 1rem 0.2rem} .tag_selector{} .bwf_tag{display:block} .tagMenuBaloon {overflow: hidden; height: 0; position:relative; z-index: 10; transition: 0.5s; display: block; margin: 10px; padding: 0 4px; width: 500px; float:bottom; background: hsla(0, 0%, 99.6%, 0.96); box-shadow: 0 1px 9px 0 rgb(0 0 0 / 13%); border-color: rgba(102, 102, 102, 1);} #tagMenuToggle[type='checkbox'] { display: none;}"+
		  "#tagMenuToggle:checked + label + .tagMenuBaloon {transition: 0.5s; height: 220px; padding: 4px; } #tagMenuToggle + label {background-color: #dddddd; padding: 4px; margin: 5px; border-radius: 4px;} .tagMenuBaloon button:hover{background-color: #bbbbbb; transition: 0.2s;} .tagMenuBaloon select {width: 50%}";
    const TAGBaloonButtonCss = ".TAGAddButton {float: right; height: 150%; border-width: 1px; border-radius: 5px;} .tagTextField[type='text'] {padding: 0.1rem; width: 40%}";
    const TAGBaloonCss = ".TAGAddBaloon {display: block; position:absolute; top: 50%; left: 90%; z-index: 10; height: 150px; width: 250px; overflow: auto; padding: 4px; float:bottom; background: hsla(0, 0%, 99.6%, 0.96); box-shadow: 0 1px 9px 0 rgb(0 0 0 / 13%); border-radius: 5px; border-width: 1px; border-color: rgba(102, 102, 102, 1);}"
    let style = document.createElement('style')
    const css = overrideCss + tagMenuCss + TAGBaloonButtonCss + TAGBaloonCss;
    style.innerHTML = css;
    document.head.append(style);

    //Load / Create datas
    if($.cookie("bwf_tag_categories") == undefined) {
        tag_categories = [
            "カテゴリ1",
			"カテゴリ2",
        ];
        tags = [
            [],
            [],
        ];
    } else {
        tag_categories = JSON.parse($.cookie("bwf_tag_categories"));
        tags = JSON.parse($.cookie("bwf_tags"));
		currentHideMode = $.cookie("bwf_hidemode");
    }


    //Funtions
	function omitText(text, maxLength){
		var ret =  text.length > maxLength ? (text).slice(0,maxLength)+"…" : text;
		return ret;
	}

	function save(){
		$.cookie("bwf_tag_categories", JSON.stringify(tag_categories), { expires: 180 });
		$.cookie("bwf_tags", JSON.stringify(tags), { expires: 180 });
		$.cookie("bwf_hidemode", currentHideMode, { expires: 180 });
	}


	function refreshTagSelector(){
		$(".tag_selector").children().remove();
		$(".tagMenuSelect").children().remove();
		$(".tag_selector").append("<option selected default value='0'>フィルター無し");
		tag_categories.forEach(function(value, i){
			var option = $('<option>')
			.text(omitText(value, 25))
			.val(i+1);
			$(".tag_selector").append(option);
			option = $('<option>')
			.text(omitText(value, 25))
			.val(i+1);
			$(".tagMenuSelect").append(option);
		}, tag_categories);
		$(".tag_selector").append("<option value='-1'>タグ未登録");

	}


	function filterItems(tagID, mode){
		$(".item-card__wrap").each(function(i, element){
			var matched = true;
			if(tagID==-2){
				tags.forEach(function(value, i){
					if(value.includes($(element).prop("id"))) matched = false;
				});

			}
			if(tagID>=0 && !tags[tagID].includes($(element).prop("id"))) matched = false;

			if(!matched){
				if(mode == hideMode.transparent){
					$(element).children().css({ 'opacity' : 0.2 });
					$(element).parent().show();
				}
				if(mode == hideMode.hide){
					$(element).parent().hide();
					$(element).children().css({ 'opacity' : 1 });

				}
			}else{
				$(element).parent().show();
				$(element).children().css({ 'opacity' : 1 });
			}
		});
	}


	function refreshTagList(tagCheckbox){
		var id;
		id = $(tagCheckbox).parents(".item-card__wrap").prop("id");
		$(tagCheckbox).children().remove();
		tag_categories.forEach(function(value, j){
			$(tagCheckbox).append("<label class='bwf_tag' for='tag_"+id+"_"+j+"'><input type='checkbox' name='tag' id='tag_"+id+"_"+j+"' value='"+j+1+"'>"+omitText(value, 25)+"</input></label>");
			$("input[id='tag_"+id+"_"+j+"']").prop('checked',tags[j].includes(id));

			$("input[id='tag_"+id+"_"+j+"']").each(function(i, element){
				$(element).on('change', function() {
					var id = $(this).parents(".item-card__wrap").prop("id");
					console.log(id);
					if(!tags[j].includes(id)){
						tags[j].push(id);
					}else{
						tags[j].splice(tags[j].indexOf(id));
					}
					filterItems($(".tag_selector").val()-1, currentHideMode)
					save();
				});
			});
		});
	}


	//Add menu
	const tagMenuBaloon = "<div class='tagMenuBaloon'>タグリスト<br><select class='tagMenuSelect' size='5'></select><br><input class='tagTextField' type='text' placeholder='タグ名'></input><button id='add_tag'>追加</button><button id='remove_tag'>削除</button><br>マッチしないアイテムの表示:<select id='hideMode'><option value='0'>半透明<option value='1' selected>非表示</select></div>"
    $(".manage-page-body .container").prepend("<div class='tagMenu'>フィルター:<select class='tag_selector'></select><input type='checkbox' id='tagMenuToggle'></input><label for='tagMenuToggle'>タグを管理</label>"+tagMenuBaloon+"</div>");

    refreshTagSelector();
	$(".tag_selector").on("change",function(){
		filterItems($(this).val()-1, currentHideMode);
	});
	$(".tagMenuSelect").on("change",function(){
		$(".tagTextField").val(tag_categories[$(this).val()-1]);
	});

	$("#add_tag").on("click", function() {
		var index = tag_categories.indexOf($(".tagTextField").val());
		if(index == -1 && $(".tagTextField").val() != ""){
			tag_categories.push($(".tagTextField").val());
			tags.push([]);
		}
		refreshTagSelector();
		save();
	});
	$("#remove_tag").on("click", function() {
		var index = tag_categories.indexOf($(".tagTextField").val());
		if(index!=-1){
			tag_categories.splice(index,1);
			tags.splice(index,1);
		}
		refreshTagSelector();
		filterItems(-1, currentHideMode);
		save();
	});
	$("#hideMode").on("change", function() {
		currentHideMode = $(this).val();
		filterItems($(".tag_selector").val()-1, currentHideMode);
		save();
	});
    //Add TAG button
    const tagBaloon = "<div class='TAGAddBaloon'>タグを登録:<div class='tagCheckbox'></div><br></div>";
    $(".item-card__category").each(function(i, element){
        $(element).children().before("<div><button class='TAGAddButton'>TAG</button>"+tagBaloon+"</div>");
    });
	$(".TAGAddBaloon").hide();
    $(".TAGAddButton").each(function(i, element){
        $(element).on('click', function() {
			var baloon = $(element).nextAll(".TAGAddBaloon:first");
			refreshTagList($(baloon).children(".tagCheckbox"));
			baloon.toggle();
		});
    });


	$(document).on('click',function(e) {
   if(!$(e.target).closest('.item-card__category').length) {
     $(".TAGAddBaloon").hide();
   }else{
	   $(e.target).closest('.item-card__category').children().show();
   }
});
})();
