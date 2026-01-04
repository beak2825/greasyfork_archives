// ==UserScript==
// @name         FuckBadDriver-FixTW檢舉交通違規
// @version      0.7
// @description  輸入經緯度，取得中文地址，使用注意事項請見下面註解
// @author       Yich
// @match        https://fixtw.com/cases/new
//@run-at  document-end
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/175593
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/390252/FuckBadDriver-FixTW%E6%AA%A2%E8%88%89%E4%BA%A4%E9%80%9A%E9%81%95%E8%A6%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/390252/FuckBadDriver-FixTW%E6%AA%A2%E8%88%89%E4%BA%A4%E9%80%9A%E9%81%95%E8%A6%8F.meta.js
// ==/UserScript==
/************
使用注意事項:
1.需要Google的Api key，並enable geocoding api和cloud vision api兩個api
目前是使用我自己申請的api key
2.Chrome安裝Allow CORS: Access-Control-Allow-Origin套件
才能存取上傳的圖片和影片
3.如果要支援不同廠牌的行車紀錄器，或是行車紀錄器影片的時間、坐標格式有更改
可以修改callVision()裡面，呼叫google vision api後的regex判斷
*************/
var Api_Key = 'AIzaSyD53MvNMH22ywv2em3h2HXPDPv9ixMUD9Y';

(function() {
    $("#vio_type").after(`<div class='form-group'>
                                                     <div class='input-group'>
                                                       <input class='form-control' type='text' id='latlng' style='width:250px' placeholder='經緯度 ex. 25.0800,121.5671'/>
                                                       <button type='button' class = 'btn-info' id='btnGetAddress' style='margin-left:10px;margin-right:10px'>取得地址</button>
                                                       <select id="addressList" style='width:400px'></select><br>
                                                   </div>
                                                   <div id="progress"></div>
                                                </div>`);
    //點擊取得地址按鈕
    $("#btnGetAddress").click(function() {
        var latlng = $("#latlng").val();
        if (latlng) {
            var address = GetAddress(latlng);
            if (address.length > 0) {
                $('#addressList').empty();
                $(".illegal-place-input").find("textarea").val(address[0]);
                $.each(address, function(key, value) {
                    $('#addressList')
                        .append($("<option></option>")
                            .attr("value", value)
                            .text(value));
                });
            } else {
                alert("無法取得地址");
            }

        } else {
            alert("請輸入經緯度");
        }
    });
    //選擇地址的下拉選單時，變更textarea的地址
    $('#addressList').on('change', function() {
        $(".illegal-place-input").find("textarea").val(this.value);
    });


    //當上傳影片時，自動取得影片上的文字
    waitForKeyElements("span.image_picker_image", tirggerWhenImageUpload);

    //GetAddress("25.0800,121.5671");

})();
//================= functions =====================================


//輸入坐標，取得地址
function GetAddress(latlng) {
    //latlng format example:  40.714224,-73.961452
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng +
        '&result_type=street_address|route|premise|intersection|colloquial_area|subpremise' +
        '&language =zh-TW&key=' + Api_Key

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    var res = JSON.parse(xmlHttp.responseText);
    var myRegexp = /(?!\d)(.*)/;
    var address = $.map(res.results, function(el) {
        var match = myRegexp.exec(el.formatted_address);
        var street = match[1].replace("台灣", "");
        return street;
    });
    address = $.grep(address, function(v) {
        return v.length > 6;
    });
    return address;
}

//截取影片中的圖片
function getVideoImage(blob) {
    $("#progress").html("<p>開始截取影片中的圖片</p>");
  var me = this, video = document.createElement('video');
  video.onseeked = function(e) {
    var canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.src = canvas.toDataURL("image/png");
      img.src = img.src.replace(/^data:image\/(png|jpg);base64,/, "");
    callVision(img.src);
  };
  video.onerror = function(e) {
      $("#progress").html("<p>截取影片中的圖片失敗</p>");
  };
  video.src = blob;//這裡的src用blob物件，而不是用url，防止cors
}

function loadVideo(videoUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', videoUrl);
        xhr.responseType = 'blob';//注意，要設置這個請求頭，自己看下面列出的XMLHttpRequest Level 2內容介紹
        $("#progress").html("<p>取得影片objectUrl中.. url:"+videoUrl+"<p>");

        xhr.onreadystatechange = function () {
            if (4 == xhr.readyState) {
                if (200 == xhr.status) {
                    var blob = new Blob([xhr.response], { type: 'video/mp4' });
                    getVideoImage(URL.createObjectURL(blob));
                }
                else {
                    $("#progress").html('<p>loadVideoFail:'+xhr.status + '\n' + xhr.responseText+'<\p>')
                }
            }
        }
        xhr.send(null);
}


// 讀取圖片檔
function getBase64Image(imgUrl) {
    $("#progress").html("<p>取得base64圖片中.. url:"+imgUrl+"<p>");
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var uInt8Array = new Uint8Array(xhr.response);
    var i = uInt8Array.length;
    var binaryString = new Array(i);
    while (i--)
    {
      binaryString[i] = String.fromCharCode(uInt8Array[i]);
    }
    var data = binaryString.join('');
    var b64 = btoa(data);
    callVision(b64);
}

xhr.open('GET', imgUrl);
xhr.responseType = 'arraybuffer';
xhr.send();
}

// Post [Google Cloud Vision API] Request
function callVision(Base64_Image) {

    var request = {
        "requests": [{
            "image": {
                "content": Base64_Image
            },
            "features": [{
                "type": "TEXT_DETECTION",
                "maxResults": 1
            }]
        }]
    };

    $.ajax({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=' + Api_Key,
        contentType: 'application/json',
        data: JSON.stringify(request),
        processData: false,
        success: function(data) {
            var result = data.responses[0].fullTextAnnotation.text;
            if (result) {
                //提取出時間和座標
                console.log('image OCR result:'+result);
                var regex = /(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2})/;
                var match = regex.exec(result);
                if(match){
                    var picTime = match[1];
                    $("#case_illegal_at").val(picTime.replace("/","-"));//將時間格式轉成yyyy-mm-dd hh:mm
                }
                var regexlatlng = /E([\d\.]+).*N([\d\.]+)/;
                var matchlatlng = regexlatlng.exec(result);
                if(matchlatlng){
                  var latlng = matchlatlng[2]+','+matchlatlng[1];//matchlatlng[2] = 緯度N   matchlatlng[1] = 經度E
                  $("#latlng").val(latlng);
                  $("#btnGetAddress").click();
                }
                $("#progress").html("<p>google OCR辨識成功</p>");
            }
        },
        error: function(data, textStatus, errorThrown) {
            console.log('call google API Error: ');
            console.log(data);
        }
    })
}
//當上傳圖片或影片時會觸發
function tirggerWhenImageUpload() {
    //經緯度和違規地點的input尚未輸入時才會執行
    if(!$("#latlng").val()&&!$(".illegal-place-input").find("textarea").val()){
      $("#case_image_ids > option").each(function() {
          var type = $(this).attr("data-source-type");
          var src = $(this).attr("data-img-src");
          if (type === "video") {
              $("#progress").html("<p>已上傳檔案  類型:影片</p>");
              loadVideo(src);
          } else if (type === "image") {
              $("#progress").html("<p>已上傳檔案  類型:圖片</p>");
              getBase64Image(src);
          }
      });
    }
}