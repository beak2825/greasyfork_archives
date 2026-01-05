// ==UserScript==
// @name NicoDicBBSViewer
// @description ニコニコ大百科のBBSの拡張
// @namespace http://threeaster.net
// @include http://dic.nicovideo.jp/a/*
// @include http://dic.nicovideo.jp/b/*
// @include http://dic.nicovideo.jp/l/*
// @include http://dic.nicovideo.jp/v/*
// @include http://dic.nicovideo.jp/i/*
// @include http://dic.nicovideo.jp/u/*
// @include https://dic.nicovideo.jp/a/*
// @include https://dic.nicovideo.jp/b/*
// @include https://dic.nicovideo.jp/l/*
// @include https://dic.nicovideo.jp/v/*
// @include https://dic.nicovideo.jp/i/*
// @include https://dic.nicovideo.jp/u/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant GM_getValue
// @grant GM_setValue
// @version 1.2.1
// @downloadURL https://update.greasyfork.org/scripts/2288/NicoDicBBSViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/2288/NicoDicBBSViewer.meta.js
// ==/UserScript==
$.noConflict();
var net_threeaster_NicoDicBBSViewer = {};
(function($){
	//-----UrlAnalyzer-----
	function UrlAnalyzer(){};

	UrlAnalyzer.prototype.getNowUrl = function(){
		return document.URL;
	};

	UrlAnalyzer.prototype.inArticlePage = function(){
		return this.getNowUrl().indexOf("//dic.nicovideo.jp/b/") === -1;
	};

	UrlAnalyzer.prototype.getBBSURLs = function(pager){
		if(pager.size() === 0){
			return [];
		}
		var urls = pager.find("a").not(".navi").map(function(){return this.href}).get();
		var bbsURLs = [];
		if(urls.length){
			var lastURLParts = urls[urls.length - 1].split("/");
			var lastNumber = lastURLParts[lastURLParts.length - 1].replace("-", "");
			if(!this.inArticlePage()){
				var nowURLParts = this.getNowUrl().split("#")[0].split("/");
				var nowNumber = nowURLParts[nowURLParts.length - 1].replace("-", "");
				lastNumber = (lastNumber - 0 >= nowNumber - 0) ? lastNumber : nowNumber;
			}
			lastURLParts.pop();
			var basicURL = lastURLParts.join("/") + "/";
			for(var i = lastNumber; i > 0; i -= 30){
				bbsURLs.unshift(basicURL + i + "-");
			}
		}else{
			var url = this.getNowUrl();
			if(url.indexOf("#") !== -1){
				url = url.substring(0, url.indexOf("#"));
				if(url.indexOf("-") === -1){
					url = url + "-";
				}
			}
			bbsURLs.push(url);
		}
		return bbsURLs;
	};

	UrlAnalyzer.prototype.isPageOf = function(url){
		var nowUrl = this.getNowUrl();
		type = this.getPageType(url);
		nowType = type !== undefined ? this.getPageType(nowUrl): undefined; //idPageOfの仕様のつじつま合わせ
		url = this.getPageName(url);
		nowUrl = this.getPageName(nowUrl);
		return type === nowType && url === nowUrl;
	};

	UrlAnalyzer.prototype.getPageName = function(url){
		var type = this.getPageType(url);
		if(type !== undefined && url.indexOf(type) !== -1){
			url = url.split(type + "/")[1];
		}
		url = url.split("/")[0];
		url = url.split(":")[0];
		url = url.split("#")[0];
		return url;
	}

	UrlAnalyzer.prototype.getNowPageName = function(){
		return this.getPageName(this.getNowUrl());
	}

	UrlAnalyzer.prototype.getPageType = function(url) {
		if(url.indexOf('//dic.nicovideo.jp') !== -1){
			url = url.replace('//dic.nicovideo.jp', '');
		}
		var parts = url.split('/');
		if(parts[1] === 'b'){
			return parts[2];
		}else{
			return parts[1];
		}
	};

	UrlAnalyzer.prototype.getNowPageType = function(){
		return this.getPageType(this.getNowUrl());
	}

	UrlAnalyzer.prototype.changeNumber = function(url){
		if(this.inArticlePage()){
			return url;
		}else{
			var parts = url.split("/");
			var last = parts.pop();
			var lastParts = last.split("-");
			var lastNum = lastParts.shift();
			var lastTail = lastParts.join("-");
			var base = parts.join("/");
			var nowNum = this.getNowUrl().split("/").pop().split("-")[0];
			var newUrl = base + "/" + nowNum + "-" + lastTail;
			return newUrl;
		}
	}

	//-----ResCollection-----
	function ResCollection(ana){
		if(ana === undefined){
			this.urlAnalyzer = new UrlAnalyzer();
		}else{
			this.urlAnalyzer = ana;
		}

	}

	ResCollection.prototype.createResList =  function(dl){
		dl.find("dt").each(function(){
			var self = $(this);
			self.attr("data-number", self.find("a").eq(0).attr("name"));
			self.attr("data-name", self.find(".st-bbs_name").text());
			var id = self.text().split(":");
			id = id[id.length - 1].split("[");
			id = id[0];
			self.attr("data-id", $.trim(id));
		});
		var resheads = dl.find("dt");
		var resbodies = dl.find("dd");
		this.resList = new Array(resheads.size());
		for(var i = 0; i < resheads.size(); i++){
			this.resList[i] = new Res(resheads.eq(i), resbodies.eq(i), this.urlAnalyzer);
		}
	};

	ResCollection.prototype.createResListById = function(){
		this.resListById = {};
		for(var i = 0; i < this.resList.length; i++){
			if(!this.resListById[$(this.resList[i].reshead).attr("data-id")]){
				this.resListById[$(this.resList[i].reshead).attr("data-id")] = [];
			}
			this.resListById[$(this.resList[i].reshead).attr("data-id")].push(this.resList[i]);
		}
	};

	ResCollection.prototype.createResListByNumber = function(){
		this.resListByNumber = [];
		for(var i = 0; i < this.resList.length; i++){
			var res = this.resList[i]
			this.resListByNumber[res.reshead.attr("data-number")] = res;
		}
	};

	ResCollection.prototype.makeTooltips = function(){
		var cannotMakeTooltip = !GM_getValue("tooltipOnDicPage") && this.urlAnalyzer.inArticlePage();
		for(var i = 0; i < this.resList.length; i++){
			this.resList[i].makeIDDiv(this.resListById, !cannotMakeTooltip);
			this.resList[i].makeNumberDiv(this.resList);
			if(cannotMakeTooltip){
				continue;
			}
			if(GM_getValue("showIDTooltip")){
				this.resList[i].makeIDTooltip(this.resListById);
			}
			if(GM_getValue("showResAnchorTooltip")){
				this.resList[i].makeNumTooltip(this.resListByNumber);
			}
			if(GM_getValue("showResNumberTooltip")){
				this.resList[i].makeLinkedNumberTooltip();
			}
			if(GM_getValue("showResHandleTooltip")){
				this.resList[i].makeNumberHandleTooltip(this.resListByNumber);
			}
		}
	};

	ResCollection.prototype.showRes = function(){
		var dl = $(".st-bbs-contents dl");
		for(var i = 0; i < this.resList.length; i++){
			dl.append(this.resList[i].reshead);
			dl.append(this.resList[i].resbody);
		}
	};

	ResCollection.prototype.revivalAllRes = function(){
		for(var i = 0; i < this.resList.length; i++){
			if(this.resList[i].reshead.hasClass("deleted")){
				this.resList[i].reshead.removeClass("deleted").find(".name").html(this.resList[i].trueReshead.attr("data-name"));//ここで.nameと.tripが一緒になる。.tripを個別に処理する場合は修正すること
				this.resList[i].resbody.html("").append(this.resList[i].trueResbody.clone(true).contents()).removeClass("deleted");
			}
		}
	};

	ResCollection.prototype.setContextMenu = function(){
		for(var i = 0; i < this.resList.length; i++){
			this.resList[i].reshead.find(".ID, .IDMulti, .IDMany").unbind("click").click(function(e){
				$(this).parent(".st-bbs_resInfo").append($("#contextMenu").css({left : e.pageX, top : e.pageY}).show());
				e.stopPropagation();
			});
		}
		$("html").unbind("click").click(function(){
			$("#contextMenu").hide();
		});
	};

	//-----Res-----

	function Res(reshead, resbody, ana){
		this.reshead = reshead;
		this.resbody = resbody;
		if(ana === undefined){
			this.urlAnalyzer = new UrlAnalyzer();
		}else{
			this.urlAnalyzer = ana;
		}
	};

	Res.prototype.backupRes = function(){
		this.trueReshead = this.reshead.clone(true);
		this.trueResbody = this.resbody.clone(true);
	}

	Res.prototype.makeIDDiv = function(resListById){
		var reflectSameId = GM_getValue("classificationID") && (GM_getValue("tooltipOnDicPage") || !this.urlAnalyzer.inArticlePage());
		var addOrdinalAndTotal = function(res, sameIDRes){
			if(reflectSameId){
				return "[" + (sameIDRes.indexOf(res) + 1) + "/" + sameIDRes.length + "]"
			}else{
				return "";
			}
		}
        var insertFractionIntoDiv = function(html, fraction){
            return html.replace('</div>', fraction + '</div>')
        }
		var sameIDRes = resListById[this.reshead.attr("data-id")];
		if(reflectSameId){
			var addIDMulti = "IDMulti";
			var addIDMany = "IDMany";
		}else{
			var addIDMulti = "ID";
			var addIDMany = "ID";
		}
		if(this.reshead.find(".ID, .IDMulti, .IDMany").size() === 0){
			var s = this.reshead.html().split(":");
			if(sameIDRes.length == 1){
				s[s.length - 2] = s[s.length - 2].replace("ID", "<div class='ID'>ID</div>");
			}else if(sameIDRes.length < 5){
				s[s.length - 2] = s[s.length - 2].replace("ID", "<div class='" + addIDMulti + "'>ID</div>");
				s[s.length - 1] = insertFractionIntoDiv(s[s.length - 1], addOrdinalAndTotal(this, sameIDRes));
			}else{
				s[s.length - 2] = s[s.length - 2].replace("ID", "<div class='" + addIDMany + "'>ID</div>");
				s[s.length - 1] = insertFractionIntoDiv(s[s.length - 1], addOrdinalAndTotal(this, sameIDRes));
			}
			this.reshead.html(s.join(":"));
		}else if(this.reshead.find(".ID").size() !== 0){
			if(sameIDRes.length == 1){
			}else if(sameIDRes.length < 5){
				this.reshead.find(".ID, .IDMulti, .IDMany").removeClass("ID IDMulti IDMany").addClass(addIDMulti);
				var s = this.reshead.html().split(":");
				s[s.length - 1] = insertFractionIntoDiv(s[s.length - 1], addOrdinalAndTotal(this, sameIDRes));
				this.reshead.html(s.join(":"));
			}else{
				this.reshead.find(".ID, .IDMulti, .IDMany").removeClass("ID IDMulti IDMany").addClass(addIDMany);
				var s = this.reshead.html().split(":");
				s[s.length - 1] = insertFractionIntoDiv(s[s.length - 1], addOrdinalAndTotal(this, sameIDRes));
				this.reshead.html(s.join(":"));
			}
		}else{
			if(sameIDRes.length < 5){
				this.reshead.find(".ID, .IDMulti, .IDMany").removeClass("ID IDMulti IDMany").addClass(addIDMulti);
				var s = this.reshead.html().split("[");
				s[s.length - 1] = addOrdinalAndTotal(this, sameIDRes);
				this.reshead.html(s.join(""));
			}else{
				this.reshead.find(".ID, .IDMulti, .IDMany").removeClass("ID IDMulti IDMany").addClass(addIDMany);
				var s = this.reshead.html().split("[");
				s[s.length - 1] = addOrdinalAndTotal(this, sameIDRes);
				this.reshead.html(s.join(""));
			}
		}
	}

	Res.prototype.makeNumberDiv = function(resList){
		this.linkedResponds = [];
		var myNumber = this.reshead.attr("data-number") - 0;
		for(var i = 0; i < resList.length; i++){
			var numberAnchorsWrapset = resList[i].resbody.find("a.dic");
			var numberAnchors = [];
			if(numberAnchorsWrapset.size() !== 0){
				numberAnchorsWrapset.each(function(){
					numberAnchors.push($(this).html().split("&gt;").join(""));
				});
			}else{
				continue;
			}
			for(var j = 0; j < numberAnchors.length; j++){
				var num = numberAnchors[j];
				if(num.indexOf("-") === -1 && myNumber === num - 0){
					this.linkedResponds.push(resList[i]);
					break;
				}else if(num.indexOf("-") !== -1){
					num = num.split("-");
					if(num[0] <= myNumber && myNumber <= num[1]){
						this.linkedResponds.push(resList[i]);
						break;
					}
				}
			}
		}
		this.reshead.find("div.Number, div.NumberMulti, div.NumberMany").contents().unwrap();
		if(this.linkedResponds.length === 0){
		}else if(!GM_getValue("classificationResNumber") || this.linkedResponds.length === 1){
            this.reshead.find('.st-bbs_resNo').html("<div class='Number'>" + this.reshead.find('.st-bbs_resNo').html() + "</div>")
		}else if(this.linkedResponds.length <= 3){
            this.reshead.find('.st-bbs_resNo').html("<div class='NumberMulti'>" + this.reshead.find('.st-bbs_resNo').html() + "</div>")
		}else{
            this.reshead.find('.st-bbs_resNo').html("<div class='NumberMany'>" + this.reshead.find('.st-bbs_resNo').html() + "</div>")
		}
	}


	Res.prototype.makeIDTooltip = function(resListById){
		var sameIDRes = resListById[this.reshead.attr("data-id")];
		var divID = this.reshead.find("div[class^='ID']");
		var that = this;
		divID.unbind("mouseenter").unbind("mouseleave").hover(function(){
			var tooltip = $("<div></div>").click(function(e){e.stopPropagation();});
			for(var i = 0; i < sameIDRes.length; i++){
				tooltip.append(sameIDRes[i].reshead.clone().find("a").removeAttr("id").end());
				tooltip.append(sameIDRes[i].resbody.clone().find("a").removeAttr("id").end());
			}
			divID.append(tooltip);
			divID.focus();
			that.adjustHeightOfTooltip(tooltip);
		}, function(){
			divID.find("div").remove();
		});
	};

	Res.prototype.makeNumTooltip = function(resListByNumber){
		var that = this;
		this.resbody.find(".numTooltip > a.dic").unwrap();
		this.resbody.find("a.dic").filter(function(){return $(this).html().indexOf("&gt;&gt;") !== -1}).each(function(){
			var self = $(this);
			var num = self.html().split("&gt;").join("").split("-");
			for(var i = 0; i < num.length; i++){
				num[i] = num[i] - 0;
			}
			self.wrap("<span class='numTooltip'></span>").parent().unbind("mouseenter").unbind("mouseleave").hover(function(){
				var self = $(this);
				var tooltip = $("<div></div>");
				if(num.length === 1 || !num[1]){
					var res = resListByNumber[num[0]];
					if(res === undefined){
						return;
					}
					var cloneBody = res.resbody.clone();
					cloneBody.find(".numTooltip > a.dic").unwrap();
					tooltip.append(res.reshead.clone().find("a").removeAttr("id").end());
					tooltip.append(cloneBody.find("a").removeAttr("id").end());
				}else{
					for(var i = num[0]; i <= num[1]; i++){
						var res = resListByNumber[i];
						if(res === undefined){
							continue;
						}
						var cloneBody = res.resbody.clone();
						cloneBody.find(".numTooltip > a.dic").unwrap();
						tooltip.append(res.reshead.clone().find("a").removeAttr("id").end());
						tooltip.append(cloneBody.find("a").removeAttr("id").end());
					}
					if(tooltip.html() === $("<div></div>").html()){
						return;
					}
				}
				self.append(tooltip);
				self.focus();
				that.adjustHeightOfTooltip(tooltip);
			}, function(){
				$(this).find("div").remove();
			});
		});
	};

	Res.prototype.makeLinkedNumberTooltip = function(){
		var divNumber = this.reshead.find("div[class^='Number']");
		var linkedResponds = this.linkedResponds;
		var that = this;
		divNumber.unbind("mouseenter").unbind("mouseleave").hover(function(){
			var tooltip = $("<div></div>").click(function(e){e.stopPropagation();});
			for(var i = 0; i < linkedResponds.length; i++){
				tooltip.append(linkedResponds[i].reshead.clone().find("a").removeAttr("id").end());
				tooltip.append(linkedResponds[i].resbody.clone().find("a").removeAttr("id").end());
			}
			divNumber.append(tooltip);
			divNumber.focus();
			that.adjustHeightOfTooltip(tooltip);
		}, function(){
			divNumber.find("div").remove();
		});
	}

	Res.prototype.makeNumberHandleTooltip = function(resListByNumber){
		var nameSpan = this.reshead.find(".st-bbs_name");
		var name = nameSpan.html();
		var transformedName = name.replace(/[０１２３４５６７８９]/g, function(c){return "０１２３４５６７８９".indexOf(c);});
		var that = this;
		if(/^[0-9]+$/.test(transformedName)){
			nameSpan.wrap("<span class='NumberHandle'></span>").parent().unbind("mouseenter").unbind("mouseleave").hover(function(){
				var self = $(this);
				var tooltip = $("<div></div>");
				var res = resListByNumber[transformedName];
				if(res === undefined){
					return;
				}
				tooltip.append(res.reshead.clone().find("a").removeAttr("id").end());
				tooltip.append(res.resbody.clone().find("a").removeAttr("id").end());
				self.append(tooltip);
				self.focus();
				that.adjustHeightOfTooltip(tooltip);
			}, function(){
				$(this).find("div").remove();
			});
		}
	}

	Res.prototype.adjustHeightOfTooltip = function(tooltip){
		var a = $("html").scrollTop() + $("#topline").height();
		var b = tooltip.offset().top;
		var c = $(window).height() - $("#topline").height();
		var d = tooltip.height();
		if(a < b && b < a + c && a < b + d && b + d < a + c){
		}else if(d < c){
			if(b > a){
				tooltip.offset({top : (a + c - d) });
			}else{
				tooltip.offset({top : a});
			}
		}else{
			tooltip.offset({top : a});
			tooltip.height(c - $("#topline").height());
		}
	};

	//-----NgOperator-----
	function NgOperator(ana){
		this.ngList = {};
		this.ngList.ngid = [];
		this.ngList.ngname = [];
		this.ngList.ngword = [];
		this.ngList.ngres = [];
		if(ana === undefined){
			this.urlAnalyzer = new UrlAnalyzer();
		}else{
			this.urlAnalyzer = ana;
		}
	}
	NgOperator.prototype.initNg = function(){
		this.ngList = {};
		this.ngList.ngidText = removeUselessLines(GM_getValue("ngid"));
		if(this.ngList.ngidText){
			this.ngList.ngid = this.ngList.ngidText.split("\n");
			for(var i = 0; i < this.ngList.ngid.length; i++){
				this.ngList.ngid[i] = $.trim(this.ngList.ngid[i]);
			}
		}else{
			this.ngList.ngid = [];
		}
		this.ngList.ngnameText = removeUselessLines(GM_getValue("ngname"));
		if(this.ngList.ngnameText){
			this.ngList.ngname = this.ngList.ngnameText.split("\n");
			for(var i = 0; i < this.ngList.ngname.length; i++){
				this.ngList.ngname[i] = $.trim(this.ngList.ngname[i]);
			}
		}else{
			this.ngList.ngname = [];
		}
		this.ngList.ngwordText = removeUselessLines(GM_getValue("ngword"));
		if(this.ngList.ngwordText){
			this.ngList.ngword = this.ngList.ngwordText.split("\n");
			for(var i = 0; i < this.ngList.ngword.length; i++){
				this.ngList.ngword[i] = $.trim(this.ngList.ngword[i]);
			}
		}else{
			this.ngList.ngword = [];
		}
		this.ngList.ngresText = removeUselessLines(GM_getValue("ngres"));
		if(this.ngList.ngresText){
			this.ngList.ngres = this.ngList.ngresText.split("\n");
			for(var i = 0; i < this.ngList.ngres.length; i++){
				this.ngList.ngres[i] = $.trim(this.ngList.ngres[i]);
			}
		}else{
			this.ngList.ngres = [];
		}
	};

	NgOperator.prototype.applyNg = function(resList){
		for(var i = 0; i < resList.length; i++){
			var r = resList[i];
			var applied = false;
			if(GM_getValue("useNG")){
				var id = r.trueReshead.attr("data-id");
				var name = r.trueReshead.attr("data-name");
				for(var j = 0; !applied && j < this.ngList.ngid.length; j++){
					if(this.ngList.ngid[j] === id){
						applied = true;
					}
				}
				for(var j = 0; !applied && j < this.ngList.ngname.length; j++){
					if(name.indexOf(this.ngList.ngname[j]) !== -1){
						applied = true;
					}
				}
				for(var j = 0; !applied && j < this.ngList.ngword.length; j++){
					if(r.trueResbody.text().indexOf(this.ngList.ngword[j]) !== -1){
						applied = true;
					}
				}
				for(var j = 0; !applied && j < this.ngList.ngres.length; j++){
					var ngres = this.ngList.ngres[j].split(":");
					var number = ngres.pop();
					var URL = ngres.join(":");
					if(this.urlAnalyzer.isPageOf(URL) && r.reshead.attr("data-number") == number){
						applied = true;
					}
				}
			}

			if(applied){
				$("#contextMenu").insertAfter("#ng");
				r.reshead.find(".name").html("削除しました");
				r.reshead.find(".trip").remove();
				r.reshead.addClass("deleted");
				r.resbody.html("削除しました").addClass("deleted");
			}else if(r.reshead.hasClass("deleted")){
				r.reshead.removeClass("deleted").find(".name").html(r.trueReshead.attr("data-name"));//ここで.nameと.tripが一緒になる。.tripを個別に処理する場合は修正すること
				r.resbody.html("").append(r.trueResbody.clone(true).contents()).removeClass("deleted");
			}

			var css = $("#nicoDicBBSViewerCSS");
			if(GM_getValue("seethroughNG")){
				if(css.html().indexOf("deleted") === -1){
					css.html(css.html() + ".deleted{display:none;}");
				}
			}else{
				if(css.html().indexOf("deleted") !== -1){
					css.html(css.html().replace(".deleted{display:none;}", ""));
				}
			}
		}
	};
	//-----MenuOperator-----

	function MenuOperator(resCollection, ngOperator){
		this.resCollection = resCollection;
		this.ngOperator = ngOperator;
		this.urlAnalyzer = new UrlAnalyzer();
		this.bbsScroll = 0;
	};


	MenuOperator.prototype.bindContextMenu = function(){
		var self = this;
		$("#ngidMenu").click(function(){
			$("#contextMenu").hide();
			if($(this).parents(".st-bbs_reshead").hasClass("deleted")){
				return false;
			}
			var id = $(this).parents(".st-bbs_reshead").attr("data-id");
			var gm_ngid = GM_getValue("ngid") ? GM_getValue("ngid") : "";
			var ngidText = gm_ngid + "\n" + id;
			ngidText = removeUselessLines(ngidText);
			$("#ngidTextarea").val(ngidText);
			GM_setValue("ngid", ngidText);
			self.ngOperator.initNg();
			self.ngOperator.applyNg(self.resCollection.resList);
		});

		$("#ngnameMenu").click(function(){
			$("#contextMenu").hide();
			if($(this).parents(".st-bbs_reshead").hasClass("deleted")){
				return false;
			}
			var name = $(this).parents(".st-bbs_reshead").attr("data-name");
			var gm_ngname = GM_getValue("ngname") ? GM_getValue("ngname") : "";
			var ngnameText = gm_ngname + "\n" + name;
			ngnameText = removeUselessLines(ngnameText);
			$("#ngnameTextarea").val(ngnameText);
			GM_setValue("ngname", ngnameText);
			self.ngOperator.initNg();
			self.ngOperator.applyNg(self.resCollection.resList);
		});

		$("#ngresMenu").click(function(){
			$("#contextMenu").hide();
			if($(this).parents(".st-bbs_reshead").hasClass("deleted")){
				return false;
			}
			var number = $(this).parents(".st-bbs_reshead").attr("data-number");
			var gm_ngresText = GM_getValue("ngres") ? GM_getValue("ngres") : "";
			var pageName = self.urlAnalyzer.getNowPageName();
			var ngresText = gm_ngresText + "\n" + pageName + ":" + number;
			ngresText = removeUselessLines(ngresText);
			$("#ngresTextarea").val(ngresText);
			GM_setValue("ngres", ngresText);
			self.ngOperator.initNg();
			self.ngOperator.applyNg(self.resCollection.resList);
		});
	};


	MenuOperator.prototype.insertConfigHtml = function(){
		var self = this;
		var appendNgTextarea = function(labelcore, idcore){
			var text = "";
			text = text + '<div style="float:left; width:24%"><p>改行で区切って' + labelcore + 'を入力or削除してください。</p>';
			text = text + '<textarea id="' + idcore + 'Textarea" cols="20" rows="10" placeholder="' + labelcore + 'を改行で区切って入力してください。">';
			text = text + (GM_getValue(idcore) ? GM_getValue(idcore) : "");
			text = text + '</textarea></div>';
			$("#ng").append(text);
		}
		var appendConfigLi = function(parent, id, label){
			var text = "";
			text = text + '<li><input id="' + id + 'Checkbox" type="checkbox" ' + (GM_getValue(id) ? "checked = 'checked'" : "") + '/>' + label + '</li>';
			parent.append(text);
		}
		var appendSubList = function(parent, list, label){
			var li = $("<li>" + label + "</li>");
			li.append(list);
			parent.append(li);
		}
		var getSubUl = function(){
			return $('<ul style="list-style-type: none; margin-left:5px;"></ul>');
		}
		$("#topbarLogoutMenu").after('<li>NicoDicBBSViewer</li><li id="bbsLi" class="selected"><a href="#">掲示板を表示する</a></li><li id="ngLi"><a href="#">設定画面を表示する</a></li>');
		$(".st-bbs-contents").after('<div id="ng"></div>');
		appendNgTextarea("NGID", "ngid");
		appendNgTextarea("NGName", "ngname");
		appendNgTextarea("NGワード", "ngword");
		appendNgTextarea("NGレスを(BBSのURL:レス番号)の書式で", "ngres");

		$("#ng").append('<div style="clear:left;"><form><ul style="list-style-type: none;"></ul></form><div>');
		var parentUl = $("#ng form ul");
		//appendConfigLi(parentUl, "addToOnePage", '一つのページに継ぎ足す(更新時有効)');
		//appendConfigLi(parentUl, "autoLoad", "下までスクロールした時に次のページを読み込む");

		var ngUl = getSubUl();
		appendConfigLi(ngUl, "useNG", "NG機能を使用する");
		appendConfigLi(ngUl, "seethroughNG", "NGが適用されたレスを表示しない");
		appendSubList(parentUl, ngUl, "NG機能");

		appendConfigLi(parentUl, "tooltipOnDicPage", "記事ページでもID、番号の色分けやツールチップを表示する");

		var tooltipUl = getSubUl();
		appendConfigLi(tooltipUl, "showIDTooltip", 'ID(<span style="text-decoration:underline;">ID</span>)ツールチップを表示する');
		appendConfigLi(tooltipUl, "showResAnchorTooltip", 'レスアンカー(<span style="color: rgb(0, 102, 204);">>>1</span>)ツールチップを表示する');
		appendConfigLi(tooltipUl, "showResNumberTooltip", 'レス番(<span style="text-decoration:underline;">1</span>)ツールチップを表示する');
		appendConfigLi(tooltipUl, "showResHandleTooltip", 'レス番ハンドル(<span style="color: rgb(0, 136, 0); font-weight: bold;">1</span>)ツールチップを表示する');
		appendSubList(parentUl, tooltipUl, "ツールチップ(更新時有効)");

		var colorUl = getSubUl();
		appendConfigLi(colorUl, "classificationID", "IDを色分けし、そのIDのレスの回数を表示する");
		appendConfigLi(colorUl, "classificationResNumber", "参照されているレス番を色分けする");
		appendSubList(parentUl, colorUl, "色分け(更新時有効)");

		$("#ng").append('<button id="decideNG">保存</button>　<button id="cancelNG">キャンセル</button>　<button id="backToBbsButton">掲示板に戻る</button></div>' +
			' <ul id="contextMenu"><li id="ngidMenu">NGIDに追加</li><li id="ngnameMenu">NGNameに追加</li><li id="ngresMenu">このレスを削除</li></ul>');
	};

	MenuOperator.prototype.bindMenu = function(){
		var self = this;
		var contents = $(".st-bbs-contents, #ng");
		var backBBS = function(){
			if($(".selected").attr("id") === "bbsLi"){
				self.bbsScroll = $("html").scrollTop();
			}
			$(".selected").removeClass("selected");
			$("#bbsLi").addClass("selected");
			contents.not(".st-bbs-contents").css("display", "none");
			$(".st-bbs-contents").css("display", "block");
			$("html").scrollTop(self.bbsScroll);
			return false;
		};
		$("#bbsLi").click(backBBS);
		$("#backToBbsButton").click(backBBS);

		$("#ngLi").click(function(){
			if($(".selected").attr("id") === "bbsLi"){
				self.bbsScroll = $("html").scrollTop();
			}
			$(".selected").removeClass("selected");
			$(this).addClass("selected");
			contents.not("#ng").css("display", "none");
			$("#ng").css("display", "block");
			$("html").scrollTop($("#ng").offset().top - $("#topline").height());
			return false;
		});

		var setcbConfig = function(id){
			GM_setValue(id, $("#" + id + "Checkbox").is(":checked"));
		}

		var checkcbConfig = function(id){
			if(GM_getValue(id)){
				$("#" + id + "Checkbox").attr("checked", true);
			}else{
				$("#" + id + "Checkbox").attr("checked", false);
			}
		}

		$("#decideNG").click(function(){
			GM_setValue("ngid", $("#ngidTextarea").val());
			GM_setValue("ngname", $("#ngnameTextarea").val());
			GM_setValue("ngword", $("#ngwordTextarea").val());
			GM_setValue("ngres", $("#ngresTextarea").val());
			setcbConfig("seethroughNG");
			setcbConfig("loadAll");
			setcbConfig("addToOnePage");
			setcbConfig("autoLoad");
			setcbConfig("useNG");
			setcbConfig("tooltipOnDicPage");
			setcbConfig("showIDTooltip");
			setcbConfig("showResAnchorTooltip");
			setcbConfig("showResNumberTooltip");
			setcbConfig("showResHandleTooltip");
			setcbConfig("classificationID");
			setcbConfig("classificationResNumber");
			setcbConfig("switcherInTopMenu");
			self.ngOperator.initNg();
			self.ngOperator.applyNg(self.resCollection.resList);
		});

		$("#cancelNG").click(function(){
			$("#ngidTextarea").val(GM_getValue("ngid") ? GM_getValue("ngid") : "");
			$("#ngnameTextarea").val(GM_getValue("ngname") ? GM_getValue("ngname") : "");
			$("#ngwordTextarea").val(GM_getValue("ngword") ? GM_getValue("ngword") : "");
			$("#ngresTextarea").val(GM_getValue("ngres") ? GM_getValue("ngres") : "");
			checkcbConfig("seethroughNG");
			checkcbConfig("loadAll");
			checkcbConfig("addToOnePage");
			checkcbConfig("autoLoad");
			checkcbConfig("useNG");
			checkcbConfig("tooltipOnDicPage");
			checkcbConfig("showIDTooltip");
			checkcbConfig("showResAnchorTooltip");
			checkcbConfig("showResNumberTooltip");
			checkcbConfig("showResHandleTooltip");
			checkcbConfig("classificationID");
			checkcbConfig("classificationResNumber");
			checkcbConfig("switcherInTopMenu");
		});
	};

	//-----ManegerToReadBbs-----

	function ManagerToReadBbs(urls, ana){
		if(ana === undefined){
			ana = new UrlAnalyzer();
		}
		this.urlAnalyzer = ana;
		this.bbsUrls = urls;
		var nowUrl = ana.getNowUrl();
		if(!ana.inArticlePage()){
			if(nowUrl.indexOf("#") === -1){
				this.startIndex = urls.indexOf(nowUrl);
			}else{
				var mainurl = nowUrl.substring(0, nowUrl.indexOf("#"));
				if(mainurl.indexOf("-") === -1){
					mainurl = mainurl + "-";
				}
				this.startIndex = urls.indexOf(mainurl);
			}
		}
		this.endIndex = this.startIndex;
		this.isNowLoading = false;
		this.resCollection = new ResCollection(ana);
		this.ngOperator = new NgOperator(ana);
		this.menuOperator = new MenuOperator(this.resCollection, this.ngOperator);
	};

	ManagerToReadBbs.prototype.readPreviousBbs = function(){
		if(this.isNowLoading || this.startIndex <= 0){
			return;
		}
		$("#bbsmain").prepend("<p id='loading'>now loading...</p>");
		this.isNowLoading = true;
		this.startIndex--;
		var self = this;
		$.get(this.bbsUrls[this.startIndex], function(r){
			self.prependBbs($(r).find("dl"));
		});
		if(this.startIndex === 0){
			$("#loadPreviousPageLinks").remove();
		}
	};

	ManagerToReadBbs.prototype.prependBbs = function(dl){
		this.resCollection.revivalAllRes();
		$(".st-bbs-contents dl").prepend(dl.contents());
		this.createAndSetResList();
		$("#loading").remove();
		this.isNowLoading = false;
	};

	ManagerToReadBbs.prototype.readNextBbs = function(){
		if(this.isNowLoading || this.endIndex >= this.bbsUrls.length - 1){
			return;
		}
		$("#bbsmain").append("<p id='loading'>now loading...</p>");
		this.isNowLoading = true;
		this.endIndex++;
		var self = this;
		$.get(this.bbsUrls[this.endIndex], function(r){
			self.appendBbs($(r).find("dl"));
		});
		if(this.endIndex === this.bbsUrls.length - 1){
			$("#loadNextPageLinks").remove();
		}
	};

	ManagerToReadBbs.prototype.appendBbs = function(dl){
		this.resCollection.revivalAllRes();
		$(".st-bbs-contents dl").append(dl.contents());
		this.createAndSetResList();
		$("#loading").remove();
		this.isNowLoading = false;
	};

	ManagerToReadBbs.prototype.initSmallBbs = function(){
		this.initPager();
		this.ngOperator.initNg();
		this.createAndSetResList();
		this.menuOperator.insertConfigHtml();
		this.menuOperator.bindMenu();
		this.menuOperator.bindContextMenu();
	};

	ManagerToReadBbs.prototype.initPager = function(){
        return
		if(!GM_getValue("addToOnePage")){
			return;
		}
		var pager = $(".st-bbs-contents .pager");
		var self = this;
		if(this.urlAnalyzer.inArticlePage()){
			pager.find(".navi").remove();
		}else{
			pager.eq(0).find("a:not(:first), .current, span").remove();
			if(this.startIndex > 0){
				pager.eq(0).append("<a id='loadPreviousPageLinks' href='#'>前へ</a>");
				pager.find("#loadPreviousPageLinks").click(function(){self.readPreviousBbs(); return false;});
			}
			pager.eq(1).find("a:not(:first), .current, span").remove();
			if(this.endIndex < this.bbsUrls.length - 1){
				pager.eq(1).append("<a id='loadNextPageLinks' href='#'>次へ</a>");
				pager.find("#loadNextPageLinks").click(function(){self.readNextBbs(); return false;});
			}
		}
	};

	ManagerToReadBbs.prototype.scrollLoader = function(){
		this.reserved = false;
		var self = this;
		setInterval(function(){
			if(self.reserved){
				self.reserved = false;
				self.readNextBbs();
			}
		}, 1000);
		$(window).scroll(function(){
			if($(".selected").attr("id") === "bbsLi" && GM_getValue("autoLoad") && $("html").scrollTop() + $(window).height() > $("#bbsmain").position().top + $("#bbsmain").height()){
				self.reserved = true;
			}
		});
	};

	ManagerToReadBbs.prototype.createAndSetResList = function(){
		this.resCollection.createResList($(".st-bbs-contents dl"));
		this.resCollection.createResListById();
		this.resCollection.createResListByNumber();
		this.resCollection.makeTooltips();
		this.resCollection.setContextMenu();
		var resList = this.resCollection.resList;
		for(var i = 0; i < resList.length; i++){
			resList[i].backupRes();
		}
		this.ngOperator.applyNg(resList);
	};

	//-----単体の関数-----

	var removeUselessLines = function(s){
		if(!s){
			return;
		}
		var lines = s.split("\n");
		var storage = {};
		for(var i = 0; i < lines.length;){
			if(!lines[i] || lines[i] in storage){
				lines.splice(i, 1);
			}else{
				storage[lines[i]] = 0;
				i++;
			}
		}
		return lines.join("\n");
	};

	var initConfig = function(ids){
		for(var i = 0; i < ids.length; i++){
			if(GM_getValue(ids[i]) === undefined){
				GM_setValue(ids[i], true);
			}
		}
	}

	var insertStyle = function(){
		var idStyle = ".ID{text-decoration:underline; color:black; display:inline;} .IDMulti{text-decoration:underline; color:blue; display:inline;}" +
					".IDMany{text-decoration:underline; color:red; display:inline;}";
		var numberStyle = ".Number{text-decoration: underline; display:inline;} .NumberMulti{text-decoration: underline; display:inline; color:blue;}" +
					".NumberMany{text-decoration: underline; display:inline; color:red;}";
		var insideTooltipStyle = ".dic{display:inline;}";
		var onMouseIdStyle = ".ID:hover, .IDMulti:hover, .IDMany:hover, .dic:hover{text-decoration:none;}";
		var defaultTooltipStyle = ".ID>div, .IDMulti>div, .IDMany>div, .dic>div, .Number>div, .NumberMulti>div, .NumberMany>div, .NumberHandle>div{display:none;}";
		var onMouseTooltipStyle = ".ID:hover>div, .IDMulti:hover>div, .IDMany:hover>div, .numTooltip:hover>div," +
								" .Number:hover>div, .NumberMulti:hover>div, .NumberMany:hover>div, .NumberHandle:hover>div" +
								"{color:black; display:inline; position:absolute; background:#f5f5b5; border:solid black 1px; padding;5px; font-size:8pt; overflow:auto;" +
								" box-shadow:1px 1px; z-index:10000;font-weight:normal;}";
		var leftboxStyle = "div.left-box{border: groove 1px gray; border-radius: 5px; background-image:none;}";
		var ngStyle = "#ng{display:none;}";
		var hideMenu = "#topbarRightMenu #bbsLi.selected,#topbarRightMenu #ngLi.selected{display:none;}";
		var sidemenu = "ul#sidemenu li{border:solid 1px; width:100px;} ul#sidemenu li.selected{color:red;}";
		var contextMenuStyle = "#contextMenu{background : #d4d0c8;color : #000000;display : none;position : absolute;list-style : none;	padding-left : 0px;box-shadow : 1px 1px;}";
		var contextItemStyle = "#contextMenu li{padding : 3px;}#contextMenu li:hover{background : #0a246a;color : #ffffff;}";

		var styleTag = "<style id='nicoDicBBSViewerCSS' type='text/css'>" + idStyle + numberStyle + insideTooltipStyle + onMouseIdStyle + defaultTooltipStyle +
			onMouseTooltipStyle + leftboxStyle + ngStyle + hideMenu + sidemenu + contextMenuStyle + contextItemStyle + "</style>";

		$("link").last().after($(styleTag));
	};

	var counterAutopagerize = function(){
		$(document).bind("AutoPagerize_DOMNodeInserted", function(){
			$("[class^='autopagerize'] , dl:not(#bbsmain) , #autopagerize_message_bar").remove();
		});
	};

//以下main
	var main = function(ana){
		initConfig(["useNG", "tooltipOnDicPage", "showIDTooltip", "showResAnchorTooltip", "showResNumberTooltip", "showResHandleTooltip",
					"classificationID", "classificationResNumber"]);
		insertStyle();
		$(".st-bbs-contents dl").attr("id", "bbsmain");
		$(".border").remove();
		if(ana === undefined){
			var urlAnalyzer = new UrlAnalyzer();
		}else{
			var urlAnalyzer = ana;
		}

		var manager = new ManagerToReadBbs(urlAnalyzer.getBBSURLs($(".st-bbs-contents .pager").eq(0)), urlAnalyzer);
		manager.initSmallBbs();
		counterAutopagerize();
		//if(!urlAnalyzer.inArticlePage()){
		//	manager.scrollLoader();
		//}
	};
	//-----test用-----
	var c = net_threeaster_NicoDicBBSViewer;
	c.removeUselessLines = removeUselessLines;
	c.Res = Res;
	c.ManagerToReadBbs = ManagerToReadBbs;
	c.initConfig = initConfig;
	c.insertStyle = insertStyle;
	c.UrlAnalyzer = UrlAnalyzer;
	c.ResCollection = ResCollection;
	c.NgOperator = NgOperator;
	c.MenuOperator = MenuOperator;
	c.main = main;

	//-----main実行/テスト時には途中で止まる-----
	if(typeof GM_getValue === 'function'){
		main();
	}
})(jQuery);
