// ==UserScript==
// @name         Car Number hacker probe
// @namespace    http://tampermonkey.net/
// @version      1.0_beta
// @description  Analysis car number and link
// @author       Royal
// @match        https://www.facebook.com/*
// @grant        GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js
// @require https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.min.js
// @resource    bootstrapCSS https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css
// @downloadURL https://update.greasyfork.org/scripts/430543/Car%20Number%20hacker%20probe.user.js
// @updateURL https://update.greasyfork.org/scripts/430543/Car%20Number%20hacker%20probe.meta.js
// ==/UserScript==
document.head.appendChild(cssElement(GM_getResourceURL("bootstrapCSS")));

function cssElement(url) {
    var link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";
    link.type = "text/css";
    return link;
}


//update Checker
// Select the node that will be observed for mutations+config
const targetNode = document.querySelector('body');
const config = {
    attributes: false,
    childList: true,
    subtree: true
};

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            //console.log('A child node has been added or removed.');
            Number_converter();
        } else if (mutation.type === 'attributes') {
            //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            Number_converter()
        }
    }
};
// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
//update check finish init, waiting for call

//Info ui setup
var Nhentai_info_card_UI = ('<div class="container" style="border-radius: 30px; border-width: 100; border-style: solid; max-width: 100%; height: 70%; float: none; background-color: #1f1f1f;" id="Carinfo_Card"> <div class="row" style="border-top-left-radius: 30px; border-top-right-radius: 30px; background-color: #ed2553;"> <a href="" id="carinfo_titlelink"><h2 style="margin-left: 20px; margin-right: 20px; color: #ffffff; margin-top: 5px;" class="text-light" id="Carinfo_title">C06 我想要摸余</h2></a> </div> <div class="row" style="width: 100%; vertical-align: middle; max-height: 80%; margin-top: 10px; margin-bottom: 10px;"> <div class="col-md-4" style="max-height: auto; max-width: auto; object-fit: fill; height: 100%; width: 33%; float: left;"> <a href="" id="carinfo_imglink"><img style="object-fit: fill; max-height: 100%; width: 100%; height: 100%;" src="https://i.pixiv.cat/img-original/img/2021/07/22/21/55/36/91423419_p0.png" id="Carinfo_img"></a> </div> <div class="col-md-4" id="Carinfo_tags" style="width: 33%; float: left;"> <h3 class="text-center text-light" style="color: #ffffff;">Tags</h3> <hr class="border border-danger" id="Carinfo_tags_hr"> <button type="button" class="btn btn-dark" id="Carinfo_tags_test1">Test1</button> </div> <div class="col-md-4" style="width: 33%; float: left;"> <div class="row"> <h6 class="text-light" id="Carinfo_parodies" style="color: #ffffff; margin: 0; padding: 10px;">Parodies:</h6> <button type="button" class="btn btn-dark" id="Carinfo_tags_test2">Test2</button> </div> <div class="row"> <h6 class="text-light" id="Carinfo_characters" style="color: #ffffff; margin: 0; padding: 10px;">Characters:</h6> <button type="button" class="btn btn-dark" id="Carinfo_tags_test3">Test3</button> </div> <div class="row"> <h6 class="text-light" id="Carinfo_artists" style="color: #ffffff; margin: 0; padding: 10px;">Artists:</h6> <button type="button" class="btn btn-dark" id="Carinfo_tags_test4">Test4</button> </div> <div class="row"> <h6 class="text-light" id="Carinfo_groups" style="color: #ffffff; margin: 0; padding: 10px;">Groups:</h6> <button type="button" class="btn btn-dark" id="Carinfo_tags_test5">Test5</button> </div> <div class="row"> <h6 class="text-light" id="Carinfo_languages" style="color: #ffffff; margin: 0; padding: 10px;">Languages:</h6> <button type="button" class="btn btn-dark" id="Carinfo_tags_test6">Test6</button> </div> <div class="row"> <h6 class="text-light" id="Carinfo_number" style="color: #ffffff; margin: 0; padding: 10px;">Number:</h6> <button type="button" class="btn btn-dark" id="Carinfo_tags_test7">Test7</button> </div> </div> </div> </div>');
var Pixiv_ing_card_UI = '<div class="container" style="border-radius: 30px; max-width: 100%; height: 70%; float: none; background-color: #0396FA; border: 100 solid #0396fa;" id="img_Card"> <a href="" id="pic_imglink"><img src="https://i.pixiv.cat/img-original/img/2019/12/15/00/00/12/78296326_p0.png" style="padding: 10px; width: 100%; height: 100%; border-radius: 30px;" id="pic_img"></a> </div>';



//declare all globle var
var url_location = 0;
var cararray = [];
var Scodearray = [];
var carnumber = "0";





(function() {
    'use strict';

    // Your code here...



    $(document).ready(function() {
        //When document has loaded
        console.log("start");

        //alert('Page Load');
        //main code
        Check_url();
        setTimeout(function() {
            //Code to run After timeout elapses
            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
        }, 1000); //after this time will run




    });




})();

//unuse
function show_debug() {
    $("svg").siblings()[0].append(
        '<button type="button" id="Testbbt">Testbbt</button>'
    );
    $("#Testbbt").click(Testbbt);
}

function Testbbt(zEvent) {
    alert("Testbbt active");

}


function Check_url() {
    var pathname = window.location.pathname;
    var url = window.location.href;
    console.log("pathname = "+pathname);
    console.log(url);
    //check if it is 6 number hacker FB group, will need to update every time got ban :P
    //change this group number if groupe changed
    if (pathname == "/groups/2981318405472732" || pathname == "/groups/2981318405472732/") { //6位數駭客[2981318405472732]
        //alert("hacker");
        url_location = 1;
    }
    else{
        url_location = 0;
    }


}

function Number_converter() {
    if (url_location >= 1) {
        shortcode_search();
        globle_number_search();
    } else {
        shortcode_search();
    }
}

function shortcode_search() {
    $("[data-ad-preview=message]").each(function(index) {
        // test if message processed
        if ($(this).attr("Scheck") != "true") {
            $(this).attr("Scheck", "true");
            var str = $(this).text();
            //console.log( index + ": " + str );
            console.log(str);
            const Sregex1 = new RegExp(/({\[|\[{|\*\()(\d+|\w+)(\|)([^\[\(]+)(]}|}]|\)\*)/g);
            const Sregex2 = new RegExp(/({\[|\[{|\*\()(\d+|\w+)(\|)([^\[\(]+)(]}|}]|\)\*)/);
            var target_site = "";
            var test_result = Sregex1.test(str);
            if (test_result == true) {
                Scodearray = str.match(Sregex1);
                Scodearray.forEach((Scodeitem) => {
                    // Do something with each element
                    console.log("Scode array = " + Scodeitem);
                    cararray = Scodeitem.match(Sregex2);
                    console.log("cararray 2 = " + cararray);
                    carnumber = cararray[4];
                    //start checking for website 1=n 2=JM 3= 4= 5=

                    if (cararray[2] == "n" || cararray[2] == "N") {
                        target_site = "N";
                        setTimeout(getpage, 300, target_site, carnumber, $(this));
                    } else if (cararray[2] == "JM" || cararray[2] == "jm" || cararray[2] == "Jm" || cararray[2] == "jM") {
                        target_site = "JM";
                    } else if (cararray[2] == "PIXIV" || cararray[2] == "Pixiv" || cararray[2] == "pixiv") {
                        target_site = "PIXIV";
                        setTimeout(getpage, 300, target_site, carnumber, $(this));

                    }
                    //else if for other site 3 / 4

                    //data process finish, proceed to page genaration
                    console.log("site = [" + target_site + "]" + ":" + carnumber);

                });
                //console.log($(this));
                //$(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().prepend('<img style="object-fit: fill; max-width: 100%; max-height: auto;" src="https://i.pixiv.cat/img-original/img/2021/07/22/21/55/36/91423419_p0.png" id="Carinfo_img">');
                //$(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().prepend(sethtml);

            }
            //start handle see more
            const Sregex3 = new RegExp(/查看更多/);
            var test_result2 = Sregex3.test(str);
            if (test_result2 == true) {
                $(this).find('*:contains("查看更多")').click(function(event) {
                    console.log("查看更多 clicked");
                    var check = $(this).closest('[data-ad-preview=message]').attr("Gcheck", "false");
                    var check2 = $(this).closest('[data-ad-preview=message]').attr("Scheck", "false");
                    setTimeout(function() {
                        //Code to run After timeout elapses
                        Number_converter();
                    }, 500); //after this time will run
                    //console.log("check = " + check);
                });
                console.log("查看更多 seted");
            }
            console.log(test_result);
        }

    });

}




function globle_number_search() {
    $("[data-ad-preview=message]").each(function(index) {
        var target_site = "";
        // test if message processed
        if ($(this).attr("Gcheck") != "true") {
            $(this).attr("Gcheck", "true");
            var str = $(this).text();
            //console.log( index + ": " + str );
            console.log(str);
            const Gregex1 = new RegExp(/(J?)(\D|^)(:?|\s?)(\d{6})(\D|\s|$)/);
            var test_result = Gregex1.test(str);
            if (test_result == true) {
                cararray = str.match(Gregex1);
                console.log("car array = " + cararray);
                carnumber = cararray[4];
                //start checking for website 1=n 2=JM 3= 4= 5=
                if (cararray[2] == "n" ||cararray[2] ==  "N" ||cararray[2] ==  "") {
                    target_site = "N";
                    setTimeout(getpage,300,target_site, carnumber, $(this));
                } else if (cararray[2] == "M" ||cararray[2] ==  "m") {
                    if (cararray[1] == "J" ||cararray[1] ==  "j") {
                        target_site = "JM";
                    }
                    //fall back to N site
                } else{
                    target_site = "N";
                    setTimeout(getpage,300,target_site, carnumber, $(this));
                }
                //else if for other site 3 / 4

                //data process finish, proceed to page genaration
                console.log("site = [" + target_site + "]" + ":" + carnumber);

                //console.log($(this));

                //$(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().prepend('<img style="object-fit: fill; max-width: 100%; max-height: auto;" src="https://i.pixiv.cat/img-original/img/2021/07/22/21/55/36/91423419_p0.png" id="Carinfo_img">');
                //$(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().prepend(sethtml);

            }
            //start handle see more
            const Gregex2 = new RegExp(/查看更多/);
            var test_result2 = Gregex2.test(str);
            if (test_result2 == true) {
                $(this).find('*:contains("查看更多")').click(function(event) {
                    console.log("查看更多 clicked");
                    var check = $(this).closest('[data-ad-preview=message]').attr("Gcheck", "false");
                    var check2 = $(this).closest('[data-ad-preview=message]').attr("Scheck", "false");
                    setTimeout(function() {
                        //Code to run After timeout elapses
                        Number_converter();
                    }, 500); //after this time will run
                    //console.log("check = " + check);
                });
                console.log("查看更多 seted");
            }
            console.log(test_result);
        }

    });
}





async function getpage(target_site, number, locationdom) {
    var cartitle = "";
    var cartags = [];
    var carimg = "";
    var carParodies = [];
    var carCharacters = [];
    var carArtists = [];
    var carGroups = [];
    var carLanguages = [];
    var pixiv_img_array = [];
    var pixiv_img_site = "";
    if (target_site == "N") {
        var page = "";
        page = await gmGet("https://nhentai.net/g/" + number + "/");
        var pagehtml = $(page).find("#bigcontainer").html();
        //show full target page data DEBUG
        //console.log(pagehtml);
        cartitle = "";
        $(pagehtml).find("h2.title").find("span").each(function(index) {
            cartitle = cartitle + $(this).text() + " ";
        });
        if (cartitle == "") {
            $(pagehtml).find("h1.title").find("span").each(function(index) {
                cartitle = cartitle + $(this).text() + " ";
            });
        }
        console.log("title = " + cartitle);
        carimg = $(pagehtml).find("img.lazyload").attr("data-src");
        console.log("img = " + carimg);
        cartags = [];
        $(pagehtml).find("#tags").find('*:contains("Tags:")').find("span").find("a").each(function(index) {
            cartags.push($(this).find(".name").text());
            //console.log($(this).find(".name").text());
        });
        console.log("tags = " + cartags.toString());
        carParodies = [];
        $(pagehtml).find("#tags").find('*:contains("Parodies:")').find("span").find("a").each(function(index) {
            carParodies.push($(this).find(".name").text());
            //console.log($(this).find(".name").text());
        });
        console.log("Parodies = " + carParodies.toString());
        carCharacters = [];
        $(pagehtml).find("#tags").find('*:contains("Characters:")').find("span").find("a").each(function(index) {
            carCharacters.push($(this).find(".name").text());
            //console.log($(this).find(".name").text());
        });
        console.log("Characters = " + carCharacters.toString());
        carArtists = [];
        $(pagehtml).find("#tags").find('*:contains("Artists:")').find("span").find("a").each(function(index) {
            carArtists.push($(this).find(".name").text());
            //console.log($(this).find(".name").text());
        });
        console.log("Artists = " + carArtists.toString());
        carGroups = [];
        $(pagehtml).find("#tags").find('*:contains("Groups:")').find("span").find("a").each(function(index) {
            carGroups.push($(this).find(".name").text());
            //console.log($(this).find(".name").text());
        });
        console.log("Groups = " + carGroups.toString());
        carLanguages = [];
        $(pagehtml).find("#tags").find('*:contains("Languages:")').find("span").find("a").each(function(index) {
            carLanguages.push($(this).find(".name").text());
            //console.log($(this).find(".name").text());
        });
        console.log("Languages = " + carLanguages.toString());
        console.log("car = " + number);
    }
    //insert website2 here
    else if (target_site == "PIXIV") {
        var temp_pixivsite = "";
        //is pixiv full website
        console.log("run pixiv fix");
        if (/https:\/\/i\.pximg\.net.*|http:\/\/i\.pximg\.net.*/g.test(number) == true) {
            pixiv_img_site = number.replace("https://i.pximg.net", "https://i.pixiv.cat");
            pixiv_img_site = number.replace("http://i.pximg.net", "https://i.pixiv.cat");
        } else if (/^img\/.*/gm.test(number) == true) {
            pixiv_img_site = "https://i.pixiv.cat/" + number;
        } else if (/^\/\d{4}\/.*/gm.test(number) == true) {
            pixiv_img_site = "https://i.pixiv.cat/img" + number;
        } else if (/^\d{4}\/.*/gm.test(number) == true) {
            pixiv_img_site = "https://i.pixiv.cat/img/" + number;
        } else if (/https:\/\/www.pixiv.net\/artworks\/.*|^\d{8}$/gm.test(number) == true) {
            if (/^\d{8}$/gm.test(number) == true) {
                temp_pixivsite = "https://www.pixiv.net/artworks/" + number;
            } else {
                temp_pixivsite = number;
            }
            var page2 = "";
            console.log("search pixiv : " + temp_pixivsite);
            page2 = await gmGet(temp_pixivsite);
            console.log(page2);
            Pixivregex1 = new RegExp(/("original":")(https:\/\/i\.pximg\.net\/img-original\/img)(.+)(\w{3})("},"tags")/);
            pixiv_img_array = page2.match(Pixivregex1);
            pixiv_img_site = pixiv_img_array[2]+pixiv_img_array[3]+pixiv_img_array[4];
            //console.log("preload = "+pixiv_img_site);
            pixiv_img_site = pixiv_img_site.replace("https://i.pximg.net", "https://i.pixiv.cat");
        }
        console.log("pixiv_img_site = " + pixiv_img_site);
        //finish rebuilding the website
    }

    // start setting page
    if (target_site == "N" ||target_site ==  "JM") {
        var sethtml = $.parseHTML(Nhentai_info_card_UI);
        $(sethtml).find("#Carinfo_title").text(cartitle);
        //extra code workaround for Nhentai 403 error, search image from google instad of Nheatai src
        var googleimg = "";
        googleimg = await gmGet("https://google.com/search?q=" + cartitle + "&tbm=isch");
        googleimg = $.parseHTML(googleimg);
        //console.log(googleimg);
        carimg = $(googleimg).find("table:nth-of-type(1)").find("img").attr("src");
        console.log("workaround image = " + carimg);
        //end of workaround code
        $(sethtml).find("#carinfo_titlelink").attr("href", "https://nhentai.net/g/" + number + "/");
        $(sethtml).find("#carinfo_imglink").attr("href", "https://nhentai.net/g/" + number + "/");
        $(sethtml).find("#Carinfo_tags_test7").text(number);
        $(sethtml).find("#Carinfo_img").attr("src", carimg);
        // start set tags
        var carinfo_tagstemp = "";
        cartags.forEach((item, i) => {
            var item_to_taghtml = createtag(item);
            //$(sethtml).find("#Carinfo_tags_test1").parent().append(item_to_taghtml);
            carinfo_tagstemp = carinfo_tagstemp + item_to_taghtml;
        });
        //console.log("tagtemp : "+carinfo_tagstemp)
        $(sethtml).find("#Carinfo_tags_test1").parent().append(carinfo_tagstemp);
        $(sethtml).find("#Carinfo_tags_test1").remove();
        //finsh set tags
        // start set Parodies
        var carinfo_tagstemp2 = "";
        carParodies.forEach((item, i) => {
            var item_to_taghtml = createtag(item);
            //$(sethtml).find("#Carinfo_tags_test1").parent().append(item_to_taghtml);
            carinfo_tagstemp2 = carinfo_tagstemp2 + item_to_taghtml;
        });
        //console.log("tagtemp : "+carinfo_tagstemp)
        $(sethtml).find("#Carinfo_tags_test2").parent().append(carinfo_tagstemp2);
        $(sethtml).find("#Carinfo_tags_test2").remove();
        //finsh set Parodies
        // start set Characters
        var carinfo_tagstemp3 = "";
        carCharacters.forEach((item, i) => {
            var item_to_taghtml = createtag(item);
            //$(sethtml).find("#Carinfo_tags_test1").parent().append(item_to_taghtml);
            carinfo_tagstemp3 = carinfo_tagstemp3 + item_to_taghtml;
        });
        //console.log("tagtemp : "+carinfo_tagstemp)
        $(sethtml).find("#Carinfo_tags_test3").parent().append(carinfo_tagstemp3);
        $(sethtml).find("#Carinfo_tags_test3").remove();
        //finsh set Characters
        // start set Artists
        var carinfo_tagstemp4 = "";
        carArtists.forEach((item, i) => {
            var item_to_taghtml = createtag(item);
            //$(sethtml).find("#Carinfo_tags_test1").parent().append(item_to_taghtml);
            carinfo_tagstemp4 = carinfo_tagstemp4 + item_to_taghtml;
        });
        //console.log("tagtemp : "+carinfo_tagstemp)
        $(sethtml).find("#Carinfo_tags_test4").parent().append(carinfo_tagstemp4);
        $(sethtml).find("#Carinfo_tags_test4").remove();
        //finsh set Artists
        // start set Groups
        var carinfo_tagstemp5 = "";
        carGroups.forEach((item, i) => {
            var item_to_taghtml = createtag(item);
            //$(sethtml).find("#Carinfo_tags_test1").parent().append(item_to_taghtml);
            carinfo_tagstemp5 = carinfo_tagstemp5 + item_to_taghtml;
        });
        //console.log("tagtemp : "+carinfo_tagstemp)
        $(sethtml).find("#Carinfo_tags_test5").parent().append(carinfo_tagstemp5);
        $(sethtml).find("#Carinfo_tags_test5").remove();
        //finsh set Groups
        // start set Languages
        var carinfo_tagstemp6 = "";
        carLanguages.forEach((item, i) => {
            var item_to_taghtml = createtag(item);
            //$(sethtml).find("#Carinfo_tags_test1").parent().append(item_to_taghtml);
            carinfo_tagstemp6 = carinfo_tagstemp6 + item_to_taghtml;
        });
        //console.log("tagtemp : "+carinfo_tagstemp)
        $(sethtml).find("#Carinfo_tags_test6").parent().append(carinfo_tagstemp6);
        $(sethtml).find("#Carinfo_tags_test6").remove();
        //finsh set Languages
        //insert main page
        //check if page already pasted
        var checklocation01 = $(locationdom).closest('[role=article]').parent().find("#Carinfo_Card").is("#Carinfo_Card");
        if (checklocation01 != true) {
            $(locationdom).closest('[role=article]').prepend(sethtml);
        }
        //old location
        //var checklocation01 = $(locationdom).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().find("#Carinfo_Card").is("#Carinfo_Card");
        //if (checklocation01 != true){
        //    $(locationdom).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().prepend(sethtml);
        //}
        //console.log("locationdom = "+locationdom);
        console.log(sethtml);
    }
    if (target_site == "PIXIV") {
        var sethtml = $.parseHTML(Pixiv_ing_card_UI);
        $(sethtml).find("#pic_img").attr("src", pixiv_img_site);
        $(sethtml).find("#pic_imglink").attr("href", pixiv_img_array[2]+pixiv_img_array[3]+pixiv_img_array[4]);
        //check if page already pasted
        var checklocation02 = $(locationdom).closest('[role=article]').parent().find("#img_Card").is("#img_Card");
        if (checklocation02 != true) {
            $(locationdom).closest('[role=article]').prepend(sethtml);
        }

    }

    return;
}




function createtag(arg) {
    var buttonhtml = '<button type="button" class="btn btn-dark">' + arg + '</button>';
    return buttonhtml;
}



function gmGet(args) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest(
            Object.assign({
                method: 'GET',
            }, args.url ? args : {
                url: args
            }, {
                onload: e => resolve(e.response),
                onerror: reject,
                ontimeout: reject,
                headers: {
                    "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
                    Accept: "application/atom+xml,application/xml,text/xml",
                },
                anonymous: true,
            })
        );
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
