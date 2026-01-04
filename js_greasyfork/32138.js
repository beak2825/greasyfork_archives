// ==UserScript==
// @name       sukebei preview
// @namespace  https://sukebei.nyaa.si/
// @author      etorrent
// @version    1.94
// @description  sukebei preview script
// @include     http*://sukebei.nyaa.*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.3.1/markdown-it.min.js
// @grant       GM_xmlhttpRequest
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/32138/sukebei%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/32138/sukebei%20preview.meta.js
// ==/UserScript==


var urlOpt = {
	//이미지 링크 추가
	img: ["pornhd720p.com","pixsense.net", "imgwallet.com", "img.yt", "imgstudio.org", "hentai-jav.top", "hentai-sun.top", "star-hentai.com", "hentai-baka.com", "imageteam.org"],
	//html 링크 추가
	html: ["postadult.info","ecoimages.xyz","imagespublic.tk","imagede.top","imgblaze.net","imgweng.xyz","imgfrost.net","picshub.co","hentai-covers.site","imgbaron.com","iceimg.net","chaosimg.site","vestimage.site","picbaron.com","hotimg.site","imagexport.com","imgchili.net","iceimg.net","imgflare.com","imghost.top","xxx.pornscreen.xyz","imagetwist.com","imgazel.info","55888.eu","imgadult.com","dimtus.com","damimage.com","imagedecode.com","pixsense.net","imgtaxi.com","imgseed.com","h-hentai.com","imgdrive.net"],
	imgfile: ["pixsense.net","iceimg.net","chaosimg.site","vestimage.site"],
	ogimage: ["postadult.info","picshub.co","hentai-covers.site","imgadult.com","imgdrive.net","imgtaxi.com"],
	center: ["imagede.top","hotimg.site","imghost.top","xxx.pornscreen.xyz","imgazel.info","55888.eu","dimtus.com","damimage.com","imgseed.com","imagedecode.com"],
	setcookie: ["picbaron.com","imgbaron.com"],
	continuetoimage: ["imagespublic.tk","ecoimages.xyz"]
}
var markdownOptions = {
    html: false,
    breaks: true,
    linkify: true,
    typographer: true
};
var markdown = window.markdownit(markdownOptions);
markdown.renderer.rules.table_open = function(tokens, idx) {
    return '<table class="table table-striped table-bordered" style="width: auto;">';
};

$(function() {
	$("body").append("<label class='nyaa_check' style='position:absolute;right:5px;top:60px;font-size:12px'><input type='checkbox' id='nyaa_check' checked='checked' style='display:inline-block;margin:-1px 2px 0 0;vertical-align:middle'>사용</label>");
	$("#nyaa_check").on("change", function() {
		localStorage.setItem("nyaa_check", this.checked ? "use" : "no");
		if(this.checked) {
			location.reload();
		}
	});
	
	var getNyaaUse = localStorage.getItem("nyaa_check");
	if(getNyaaUse != undefined && getNyaaUse != null && getNyaaUse == "no") {
		$("#nyaa_check").prop("checked",false).trigger("change");
		return false;
	}
	
	page.load();
        page.convertload();

	var convertIdx = 0;
	$(".torrent-list tbody tr").each(function(key) {        
		var getTarget = $(this);
		var getUrl = getTarget.find("td:eq(1) a").attr("target","_blank").attr("href");
		var getTime = getTarget.find("td:eq(4)").text();
		if(getUrl != undefined && getUrl != "" && getUrl.indexOf("view") > -1) {			
			page.checkpoint(true, getUrl);
			
			if(page.data[getUrl] == undefined) {
				page.list.push([getTarget, getUrl, getTime]);
			}
			else {
				convertIdx += 1;
				setTimeout(function() {
					page.convert(getTarget, page.data[getUrl][0], page.data[getUrl][1]);
				}, convertIdx * page.delay);
			}
		}
	});
	
	//임시 클릭시 실행하기
	if(page.autoload == false) {
		$("body").on("click", ".torrent-list .preview_box", function() {
			var getTarget = $(this);
			if(!getTarget.hasClass(".preview_box")) getTarget = $(this).closest(".preview_box");
			var target = getTarget.data("target");
			var data = getTarget.data("data");
			var time = getTarget.data("time");
			page.converthtml(getTarget, target, data, time);
			return false;
		});
	}

	page.detail(0);
	
	if(page.debug == true) {
		$("body").append("<textarea id='input_debug' style='position:fixed;left:0;top:0;width:80px;height:60px;z-index:10000'></textarea>");
		$("#input_debug").on("focusin", function() {
			$(this).css({ width:500, height:200 });
		}).on("focusout", function() {
			$(this).css({ width:80, height:60 });
		});
	}
});

var page = {
	autoload: true,
	debug: false,
	delay: 600,
	list: [],
	data: {},
	link: {},
	prevlist: [0],
	urlcheck: function(type, url) {
		var result = false;
		$.each(urlOpt[type], function(key, value) {
			if(url.indexOf(value) > -1) {
				result = true;
				return false;
			}
		});
		return result;
	},
	detail: function(idx) {
		if(page.list[idx] == undefined) return;
		$.ajax({
			url:page.list[idx][1],
			dataType:"html",
			success:function(data) {
				//console.log(data);
				if(data && data.indexOf("torrent-description") > -1) {
					var getHtml = $(data).find("#torrent-description").html();
					page.data[page.list[idx][1]] = [getHtml, page.list[idx][2]];
					page.convert(page.list[idx][0], getHtml, page.list[idx][2]);

					page.save();
				}
				setTimeout(function() {
					page.detail(idx + 1);
				}, page.delay);
			},
			error:function() {
				setTimeout(function() {
					page.detail(idx + 1);
				}, page.delay);
			}
		});
	},
	convert: function(target, data, time) {
		//console.log(data);
		var getDescHtml = markdown.render(data);
		var getPreviewBox = $("<tr class='preview_box'><td colspan='9' style='padding:5px;white-space:normal' class='viewdescription'>" + getDescHtml + "</td></tr>").insertAfter(target);
		getPreviewBox.data({ target:target, data:data, time:time });
		
		//클릭시 실행하게 막기
		if(page.autoload == true) {
			page.converthtml(getPreviewBox, target, data, time);
		}
	},
	converthtml: function(getPreviewBox, target, data, time) {
		getPreviewBox.find("a").each(function() {
			var getText = $(this).text();
			if(getText.indexOf("[/img") > -1 || getText.indexOf("<img") > -1) {
				getText = getText.replace("[/img]", "").replace("[/img", "");
				$(this).attr("href",getText).empty().append("<img src='" + getText + "' alt='" + getText + "' style='max-width:500px'>");
			}
			else {
				var getImgs = getText.match(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/gi);
				if(getImgs !== null && getImgs.length > 0 && getImgs[0] !== "") {
					$(this).attr("href",getText).empty().append("<img src='" + getImgs[0] + "' alt='" + getText + "' style='max-width:500px'>");
				}
			}
		});

		getPreviewBox.find("img").css({ "maxWidth": 500 }).eq(0).each(function() {
			//if($(this).parent()[0].tagName == "A" && $(this).parent().attr("href") != "") {
			//	return true;
			//}
			var getImg = $(this);
			var getLinkSrc = getImg.attr("src");
			if(page.link[getLinkSrc] != undefined && page.link[getLinkSrc] != "") {
				console.log("link data", getLinkSrc, page.link[getLinkSrc]);
				getImg.attr("src",page.link[getLinkSrc]);
			}
			else {
				var getSrc = page.image("img", getImg, getLinkSrc, time);
			}
		});
		
		getPreviewBox.find("a").attr("target","_blank").each(function() {
			$(this).slice(0,2).each(function() {
				var getLink = $(this);
				var getLinkSrc = getLink.attr("href");
				if(getLinkSrc.indexOf("imgur.com") > -1) {
					if(getLinkSrc.indexOf(".jpg") == -1 && getLinkSrc.indexOf(".jpeg") == -1 && getLinkSrc.indexOf(".png") == -1) {
						var getImg = $("<img>").attr("src", getLinkSrc + ".jpg").css("maxWidth", 500);
						var getImg2 = $("<img>").attr("src", getLinkSrc + ".png").css("maxWidth", 500);
						getLink.empty().append(getImg).append(getImg2);					
					}
					else {					
						var getImg = $("<img>").attr("src", getLinkSrc).css("maxWidth", 500);
						getLink.empty().append(getImg);
					}
				}
                else if(getLinkSrc.indexOf("pornhd720p.com") > -1) {
                    var getLinkArray = getLinkSrc.split("/img-");
                    getLinkSrc = getLinkArray[0] + "dlimg.php?id=" + getLinkArray[1].split(".")[0];
                    var getImg = $("<img>").attr("src", getLinkSrc).css("maxWidth", 500);
                    getLink.empty().append(getImg);
                }
				else if(getLinkSrc.indexOf("jav321.com") > -1 && (getLinkSrc.indexOf(".jpg") > -1 || getLinkSrc.indexOf(".png") > -1)) {
					var getImg = $("<img>").attr("src", getLinkSrc).css("maxWidth", 500);
					getLink.empty().append(getImg);
				}
				else if((getLinkSrc.indexOf("img169.com") > -1 || getLinkSrc.indexOf("imgtuku.com") > -1) && getLinkSrc.indexOf(".jp") > -1) {
					var getImg = $("<img>").attr("src", getLinkSrc).css("maxWidth", 500);
					getLink.empty().append(getImg);
				}			
				else {
					if(page.link[getLinkSrc] != undefined && page.link[getLinkSrc] != "") {
						console.log("link data", getLinkSrc, page.link[getLinkSrc]);
						var getImg = $("<img>").attr("src", page.link[getLinkSrc]).css("maxWidth", 500);
						getLink.empty().append(getImg);
					}
					else {
						var getSrc = page.image("html", getLink, getLinkSrc, time);
					}
				}
			});
		});
	},
	onload: function(type, target, src, img) {
		if(src != "") {
			console.log("onload",type,src,img);
			if(type == "img") {
				var imgObj = new Image();
				imgObj.onload = function() {
					page.link[img] = src;
					page.convertsave();
					console.log("onload success",type,src,img);

					target.addClass("active").attr("src",src).on("click", function() {
						window.open(src,"_blank");
						return false;
					});
				};
				imgObj.src = src;
			}
			else {
				if(target.find("img.active").length > 0) return;
				var imgObj = new Image();
				imgObj.onload = function() {
					page.link[img] = src;
					page.convertsave();
					console.log("onload success",type,src,img);

					var getImg = $("<img>").attr("src", src).css("maxWidth", 500);
					target.attr("src",src).empty().append(getImg);
				};
				imgObj.src = src;
			}
		}
	},
	image: function(type, target, img, time) {
		var getSrc = "";
		
		//핫링크 차단
		 //imgadult.com imgtaxi.com imgdrive.net 

		if(type == "img") {
			if(page.urlcheck("img", img)) {
			    getSrc = img.replace("small/","big/").replace("/small-","/");
			}
			else {
				//console.log("image", type,target,img,time);
			}	
			if(getSrc != "") {
				page.onload(type, target, getSrc, img);
			}
		}
		else {
			if(page.urlcheck("html", img)) {
				page.ajax(type, target, img);
			}
			else {
				console.log("html", type,target,img,time);
			}
		}

		page.onload(type, target, getSrc, img);
	},
	ajax: function(type, target, img) {
		console.log("html ajax", img);
		if(img.indexOf("imgflare.com") > -1) {
			img += "?attempt=1";
		}
		else if(page.urlcheck("imgfile", img)) {
			img = "http://www.imgfile.net/" + img.split("/").pop();
		}
        else if(img.indexOf("imgblaze.net") > -1 || img.indexOf("imgfrost.net") > -1) {
			img = img.replace("imgblaze.net","imgweng.xyz");
		}

		GM_xmlhttpRequest({
			method: "GET",
			url: img,
			overrideMimeType:"text/plain; charset=utf-8",
			headers:{
				"Content-Type": "text/plain; charset=utf-8",
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",    // If not specified, navigator.userAgent will be used.
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"            // If not specified, browser defaults will be used.
			},
			onload: function(response) {
				if(response && response.status && response.status == 200 && response.responseText) {
					//console.log("html ajax onload", img);
					try{
						var getHtml = $(response.responseText);
					}
					catch(error) {
						var getHtml = response.responseText;
					}
					
					if(page.debug == true) {
						$("#input_debug").val(response.responseText);
					}
					var getSrc = "";
					if(img.indexOf("pixsense.net_bak") > -1) {
						if(getHtml.find("#myUniqueImg").length > 0) {
							getSrc = getHtml.find("#myUniqueImg").attr("src");
							if(getSrc.indexOf("pixsense.net") == -1) {								
								getSrc = getHtml.find("#myUniqueImg").parent().attr("href");
							}
						}
					}
					else if(getSrc.indexOf("iceimg.net") > -1) {
						getSrc = getHtml.find("#myUniqueImg").attr("href");
					}
					else if(page.urlcheck("ogimage", img)) {
						if(response.responseText.indexOf("og:image") > -1) {
							var getSrcArray = response.responseText.split("og:image")[1].split("\"");
							if(getSrcArray.length > 2 && getSrcArray[2] != "") {
								getSrc = getSrcArray[2];
							}
						}

						//if(getHtml.find("meta[property='og:image']").length > 0) {
							//getSrc = getHtml.find("meta[property='og:image']").attr("content");
							//if(getSrc != undefined && getSrc != null && getSrc != "") {
							//	getSrc = getSrc.replace("/small","/big");
							//}
							//else getSrc = "";
						//}
					}
					else if(page.urlcheck("center", img)) {
						if(getHtml.find("img.centred").length > 0) {
							getSrc = getHtml.find("img.centred").attr("src");
						}
						else if(getHtml.find("img.centred_resized").length > 0) {
							getSrc = getHtml.find("img.centred_resized").attr("src");
						}
					}
					else if(img.indexOf("imgflare.com") > -1) {
						if(getHtml.find("#this_image").length > 0) {
							getSrc = getHtml.find("#this_image").attr("src");
						}
					}
					else if(img.indexOf("imgchili.net") > -1) {
						if(getHtml.find("#show_image").length > 0) {
							getSrc = getHtml.find("#show_image").attr("src");
						}
					}
					else if(img.indexOf("h-hentai.com") > -1) {
						if(getHtml.find(".dishImage").length > 0) {
							getSrc = getHtml.find(".dishImage > .attachment-full").attr("src");
						}
					}
					else if(img.indexOf("imagetwist.com") > -1 || img.indexOf("imagexport.com") > -1) {
						if(getHtml.find(".img-responsive").length > 0) {
							getSrc = getHtml.find(".img-responsive").attr("src");
						}
					}
					else if(page.urlcheck("setcookie", img)) {
						if(response.responseText.indexOf("setcookie.php?img=") > -1) {
							getSrc = response.responseText.split("setcookie.php?img=")[1].split("\"")[0];
						}
					}
					else if(img.indexOf("imgfile.net") > -1) {
						if(response.responseText.indexOf('document.getElementById("soDaBug").src') > -1) {
							getSrc = response.responseText.split('document.getElementById("soDaBug").src')[1].split('\"')[1];
						}
					}
					else if(page.urlcheck("continuetoimage", img)) {
						if(response.responseText.indexOf("'continuetoimage'>") > -1) {
							var getImg = response.responseText.split("'continuetoimage'>")[1];
							getImg = getImg.split("</div>")[0];
							getImg = getImg.split("<img")[1];
							getImg = "<img" + getImg.split(">")[0] + ">";
							getSrc = $(getImg).attr("src");

							if(getSrc !== undefined && getSrc !== "") {
								getSrc = getSrc.replace("small","big");
							}
							else getSrc = "";
						}
					}
                    else if(img.indexOf("imgblaze.net") > -1 || img.indexOf("imgweng.xyz") > -1 || img.indexOf("imgfrost.net") > -1) {
                            var getImg = response.responseText.split('document.getElementById("soDaBug")')[1];
                            getImg = getImg.split("\"")[1];
                            getSrc = getImg.split("\"")[0];

							if(getSrc !== undefined && getSrc !== "") {
								getSrc = getSrc.replace("small","big");
							}
							else getSrc = "";
					}
					if(getSrc != "") {
						page.onload(type, target, getSrc, img);
					}
				}
			}
		});
	},
	load: function() {
		var getLastTime = localStorage.getItem("sukebie_time");
		var getNowTime = new Date().getTime();
		var timeCheck = false;
		console.log("page load", parseInt(getLastTime, 10), getNowTime, getNowTime - parseInt(getLastTime, 10), getNowTime - parseInt(getLastTime, 10) < 1000 * 60 * 60);
		if(getLastTime == null || getLastTime == undefined || getLastTime == "" || getNowTime - parseInt(getLastTime, 10) < 1000 * 60 * 60) {
			timeCheck = true;
		}

		var getData = localStorage.getItem("sukebie_data");
		if(timeCheck == true && getData != null && getData !=="") {
			getData = $.parseJSON(getData);
			if(getData != null && getData != undefined && getData.data != undefined) {				
				page.data = getData.data;
				console.log("page load", page.data);
			}
		}
		else {
			console.log("데이터 초기화");
			localStorage.removeItem("sukebie_data");
			localStorage.removeItem("sukebie_list");
		}

		page.checkpoint(false, "");
	},
	saveinterval: null,
	save: function() {
		clearTimeout(page.saveinterval);        
		page.saveinterval = setTimeout(function() {
			console.log("page save", page.data);
			localStorage.setItem("sukebie_data",JSON.stringify({ time:new Date().getTime(), data:page.data }));
			localStorage.setItem("sukebie_time", new Date().getTime());
		}, 3000);
	},
	convertload: function() {        
		var getData = localStorage.getItem("sukebie_list");
		if(getData != null && getData !=="") {
			getData = $.parseJSON(getData);
			if(getData != null && getData != undefined && getData.data != undefined) {
				page.link = getData.data;
				console.log("page convertload", page.link);
			}
		}
	},
	convertsaveinterval: null,
	convertsave: function() {
		clearTimeout(page.convertsaveinterval);
		page.convertsaveinterval = setTimeout(function() {
			console.log("page convertsave", page.link);
			localStorage.setItem("sukebie_list",JSON.stringify({ time:new Date().getTime(), data:page.link }));
			localStorage.setItem("sukebie_time", new Date().getTime());
		}, 3000);
	},
	checkpoint: function(type,url) {
		if(type == true) {
			var currCheck = parseInt(url.replace("/view/",""), 10);
			var maxCheck = true;
			$.each(page.prevlist, function(key, value) {
				if(currCheck <= value) {
					maxCheck = false;
					return false;
				}
			});
			
			if(maxCheck == true) {
				page.prevlist.push(currCheck);				
				localStorage.setItem("sukebie_checkpoint_list", JSON.stringify(page.prevlist.slice(-7)));
			}
		}
		else {
			var getPrev = localStorage.getItem("sukebie_checkpoint_list");			
			if(getPrev != null && getPrev != undefined && getPrev != "") {
				page.prevlist = $.parseJSON(getPrev);
				$.each(page.prevlist, function(key, value) {
					var getLast = $(".torrent-list tbody tr a[href='/view/" + value + "']");
					if(getLast.length > 0) {
						$("<tr><td colspan='9' style='padding:5px;text-align:center;color:#fff;font-size:14px;background:#a90101'><p style='margin:0'>▼ 이전에 여기까지 읽음</p></td></tr>").insertBefore(getLast.closest("tr"));
					}
				});				
			}
		}
	}
};
