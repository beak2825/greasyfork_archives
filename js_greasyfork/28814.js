// ==UserScript==
// @name           Replace image to original
// @namespace      http://userscripts.org/users/mizuho
// @description    Change image to original
// @copyright      2013 by Mizuho (Mio)
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20250917084242
// @downloadURL https://update.greasyfork.org/scripts/28814/Replace%20image%20to%20original.user.js
// @updateURL https://update.greasyfork.org/scripts/28814/Replace%20image%20to%20original.meta.js
// ==/UserScript==

(function()
{
  var regWeibo = /\/orj\d+\/|\/thumb\d+\/|\/mw\d+\/|\/square\/|\/bmiddle\//gi;
  var regTwitter = /^(?<url>https?:\/\/pbs.twimg.com\/[^?\.]+)(?:(?:\?format=(?<new>[^&]+)&?(?:name=)?)|\.(?<old>\w+):?)(?<type>[^?=]*)$/;
  var regBltweb = /-\d+?x\d+?\./gi;
  var regAmazon = /([0-9A-Za-z\%\-]+)\.(_S[A-Z]\d*_Q?[A-Z]?\d*_?\.)?([^\/]+)$/gi;
//  var regGooglePlus = /\/(w[0-9]+[-]h[0-9]+[-]?[a-z]?[-]?[a-z]?[a-z]?)\//gi;  // \/(w[0-9]+[-]h[0-9]+[-]?[a-z]?[-]?[a-z]?[a-z]?|s[0-9]+[-][a-z0-9=,]+)\/
  var regGooglePlus = /\/([ws][0-9]+[a-z0-9-=,]*?)\//gi;
  var regGooglePhoto = /=[^\/]+$/gi;
  var regImgur = /(?:i\.)?imgur\.com\/(\w+).*/gi;

  function ChangeImageInPage(reg, replaceWord)
  {
    let pagecontainer = document;
    if (!pagecontainer) return;
    for (var i = 0; i < pagecontainer.images.length; ++i) 
    {
      let imgobj = pagecontainer.images[i];
      if (imgobj !== null) 
      {
        let link = imgobj.getAttribute('src');
        let newlink = link.replace(reg, replaceWord);
        imgobj.setAttribute('src', newlink);
      }
    }
  }

  async function Download(image, name) {
    Get = function (url, options = {}) {
      return fetch(url, options)
      .then(res => res.blob())
      .then(blob => {
        return URL.createObjectURL(blob);
      });
    };
    let img_header={'Accept':'image/jpeg,image/apng'};
    if (true) {
      let url = image.src;

      if (/\?/.test(url)) url += '&';
      else url += '?';
      url += `_=${new Date().getTime()}`;

      image.src = await Get(url, {method:'GET', headers:img_header});
      //console.log(image);

      let element = document.createElement('a');
      element.setAttribute('href', url);
      element.setAttribute('download', name);
      document.body.appendChild(element);
      element.click();
    }
  }

  let modules = [
    Bltweb = {
      domains: [/bltweb\.jp/],
      call: function (url) {
        ChangeImageInPage(regBltweb, ".");
      }
    },

    Weibo = {
      domains: [/weibo\.com/],
      call: function (url) {
        ChangeImageInPage(regWeibo, "/large/");
      }
    },

    WeiboImg = {
      domains: [/sinaimg\.cn/],
      call: function (url) {
        let newlink = url.replace(regWeibo, "/large/");
        window.location.href = newlink;
      }
    },

    TwitterImg = {
      domains: [/pbs\.twimg\.com/],
      call: function (url) {
        let imgurl = regTwitter.exec(url);
        if (imgurl !== null) {
          let newlink = imgurl.groups.url;
          if(imgurl.groups.new !== undefined)
            newlink = newlink + `?format=${('webp' == imgurl.groups.new ? 'jpg' : imgurl.groups.new)}&name=`;
          else if(imgurl.groups.old !== undefined)
            newlink = newlink + `?format=${('webp' == imgurl.groups.old ? 'jpg' : imgurl.groups.old)}&name=`;
          newlink += "orig";
          window.location.href = newlink;
        }
      }
    },

    AmazonImg = {
      domains: [/ssl-images-amazon\.com/, /media-amazon\.com/],
      call: function (url) {
        let newlink = url.replace(regAmazon, "$1._SX10000_QL200_.$3");
        window.location.href = newlink;
      }
    },

    KindleManga = {
      domains: [/read\.amazon\.co\.jp/],
      call: function (url) {
        let newlink = url.replace(/\/manga\/([^?]+).*/, "/?asin=$1");
        window.location.href = newlink;
      }
    },

    GoogleImg = {
      domains: [/lh\d+\.googleusercontent\.com/, /\.ggpht\.com/, /\d+\.bp\.blogspot\.com/,],
      call: function (url) {
        if (regGooglePlus.test(url))
          window.location.href = url.replace(regGooglePlus, "/s0-d/");
        else if (regGooglePhoto.test(url))
          window.location.href = url.replace(regGooglePhoto, "=s0-d");
      }
    },

    YoutubeShorts = {
      domains: [/youtube\.com/,],
      call: function (url) {
        if (url.match(/youtube\.com\/shorts\//))
          window.location.href = url.replace(/\/shorts\//, "/v/");
        else if (url.match(/youtube\.com\/(?:watch\?|live\/)/)) {
          let pot = prompt('pot:','');
          if (null !== pot) {
            for (let dom of document.getElementsByClassName('yt-download-item')) {
              for (let link of dom.getElementsByTagName('a')) {
                let downurl = link.getAttribute('href');
                downurl = (/&pot=/.test(downurl) ? downurl.replace(/&pot=[^&]+/, ('' !== pot ? `&pot=${pot}` : '')) : downurl.replace(/&title=/, `&pot=${pot}&title=`));
                link.setAttribute('href', downurl);
              }
            }
          }
        }
      }
    },

    YoutubeImg = {
      domains: [/ytimg\.com/],
      call: function (url) {
        (async () => {
          YT_THUMB_RES_ORDER = ['maxresdefault', 'hq720', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
          const checkImgExists = async function(link) {
            return new Promise(res => {
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', link, false);
              xhr.send();

              res(xhr.status != 404);
            });
          };

          for (const res of YT_THUMB_RES_ORDER) {
            const u = url.replace(/\/[^\/]*(default|hq720)(.*\.[^\?]+)\??.*/, "/" + res + "$2");
            if (await checkImgExists(u)) {
              window.location.href = u;
              break;
            }
          }
        })();
      }
    },

    RecochokuImg = {
      domains: [/img\.lap\.recochoku\.jp/,],
      call: function (url) {
        window.location.href = url.replace(/FF(\w)=\d+/g, "FF$1=999999999").replace(/&h=[\w%]+/, "").replace(/&option=[\w%]+/, "");
      }
    },

    YahooImg = {
      domains: [/yimg\.jp/,],
      call: function (url) {
        window.location.href = url.replace(/\/\/auc-pctr\.[^\/]+\/i\/([^\?]+).*/, "//$1");
      }
    },

    FujiTV = {
      domains: [/fujitv\.co\.jp/],
      call: function (url) {
        if(url.match(/imf\/synth[^(]+.+,u=\d(?:\/|%2[fF])([^),\s]+).+/)) {
          window.location.href = url.replace(/imf\/synth[^(]+.+,u=\d(?:\/|%2[fF])([^),\s]+).+/, unescape(RegExp.$1));
        }
      }
    },

    AbemaTimes = {
      domains: [/ismcdn\.jp/],
      call: function (url) {
        window.location.href = url.replace(/\/[^\/]+\/img/, "/-/img");
      }
    },
/*
    Imgbaron = {
      domains: [/imgbaron\.com/],
      call: function (url) {
        let filename = /\/([^\/]+)\.html/gm.exec(url);
        if(filename === null) return;
        filename = new RegExp(filename[1].replace(/([\[\]\{\}\(\)])/g, "\\$1"));
        console.log(filename[1]);
        let pagecontainer = document;
        if (!pagecontainer) return;
        for (var i = 0; i < pagecontainer.images.length; ++i) {
          var imgobj = pagecontainer.images[i];
          if (imgobj !== null) {
            if(filename.test(imgobj.src)) {
              let realLink = /img=(.+)/gm.exec(imgobj.src);
              if(realLink !== null) {
                console.log(realLink[1]);
                window.location.href = realLink[1];
                break;
              }
            }
          }
        }
      }
    },
*/
    Picbaron = {
      domains: ["imgbaron", "picbaron", "kvador", "imgsto", "picdollar", "kropic", "imgsen", "pics4you", "fotokiz",],
      call: function (url) {
        let xmlhttp = new XMLHttpRequest();
        let continueForm = document.getElementsByTagName('form');
        let formData = "op=" + continueForm[0]["op"].value + "&id=" + continueForm[0]["id"].value + "&pre=" + continueForm[0]["pre"].value;

        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
              let filename = /\/([^\/]+)\.html/gm.exec(url);
              if(filename === null) return;
              filename = new RegExp(filename[1].replace(/([\[\]\{\}\(\)])/g, "\\$1"));

              let parser = new DOMParser();
              let pagecontainer = parser.parseFromString(xmlhttp.response, "text/html");
              if (!pagecontainer) return;
              for (var i = 0; i < pagecontainer.images.length; ++i) {
                let imgobj = pagecontainer.images[i];
                if (imgobj !== null) {
                  let img = imgobj.src.replace(/%20/g, "_");
                  if(filename.test(imgobj.src) || filename.test(img)) {
                    window.location.href = imgobj.src;
                    break;
                  }
                }
              }
            } else if (xmlhttp.status == 400) {
              console.log('There was an error 400');
            } else {
              console.log('something else other than 200 was returned');
            }
          }
        };

        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send(formData);
      }
    },

    ImgdriveNet = {
      domains: ["imgdrive", "imgtaxi", "imgair", /img.*.xyz/, /img.*.buzz/, /img.*\.s+/, /img.*\.cfd/],
      call: function (url) {
        let meta = document.head.querySelector('[property="og:image:secure_url"]');
        if (meta === null)
          meta = document.head.querySelector('[property="og:description"]');
        if (meta === null)
          meta = document.head.querySelector('[property="og:image"]');

        if (meta !== null) {
          if (meta.content !== "") {
            let newlink = "";
            if (/^http/g.test(meta.content)) {
              newlink = meta.content.replace("images\/small\/", "images/big/");
            } else {
              let re = new RegExp("[\'\"]([^\'\"]+" + meta.content.replace(/([\(\)\.])/g, "\\$1") + ")[\'\"]");
              newlink = re.exec(document.body.innerHTML);
              if(newlink !== null)
                newlink = newlink[1];
            }

            if(newlink !== "")
              window.location.href = newlink;
          }
        }

/*
      var img = document.getElementsByClassName("centred_resized");
      if(img.length > 0)
        window.location.href = img[0].src;
*/
      }
    },

    Imagespublic = {
      domains: ["imagespublic"],
      call: function (url) {
        var continuetoimage = document.getElementById("continuetoimage");
        if(continuetoimage !== null) {
          var imgs = continuetoimage.getElementsByTagName("img");
          if(imgs.length > 0) {
            var newlink = imgs[0].src.replace("\/small\/", "/big/");
            window.location.href = newlink;
          }
        }
      }
    },

    Imgur = {
      domains: [/imgur\.com/],
      call: function (url) {
        let newlink = url.replace(regImgur, "imgur.com/download/$1/");
        window.location.href = newlink;
      }
    },

    Imgrock = {
      domains: ["imgrock", "picrok", "silverpic", "kropic", "pics4you", "tezzpic", "imgstar",],
      call: function (url) {
        let parentNode = undefined;
        let node = $('div[id] + div[id] > input:not([style])');
        if (node.length > 0) {
          parentNode = node[0].parentElement;
          node.click();
        } else {
          parentNode = document;
        }
 
        // get key
        let key = "";
        let keyVar = document.body.innerHTML.match(/(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})\s*\+\s*(\w{9})/);
        for(let i = 1; keyVar !== null && i < keyVar.length; ++i) {
          let re = new RegExp(`${keyVar[i]}\s*=\s*'([^']*)'`);
          if (document.body.innerHTML.match(re)) {
            key = key + RegExp.$1;
          }
        }

        let forms = parentNode.getElementsByTagName('form');
        for(const form of forms) {
          //alert(`visible: ${getComputedStyle(form).visibility}, height: ${form.offsetHeight}`);
          if(getComputedStyle(form).visibility != "hidden" && form.offsetHeight > 0) {
            //alert(form["hito"].value);
            let formData = "";
            for(const elem of form) {
              if(elem.type != "submit" && elem.type != "button") {
                if(formData !== "")
                  formData += "&";
                if(elem.name.length >= 32 && key !== "")
                  formData += key + "=" + elem.value;
                else
                  formData += elem.name + "=" + elem.value;
                //console.log("type : " + elem.type + ", name : " + elem.name + ", value : " + elem.value);
              }
            }
 
            //alert("formData: " + formData);

            let xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                  let parser = new DOMParser();
                  let pagecontainer = parser.parseFromString(xmlhttp.response, "text/html");
                  if (!pagecontainer) return;
                  //alert(xmlhttp.response);
                  for (let elem of ["pic", "picview"]) {
                    let picview = pagecontainer.getElementsByClassName(elem);
                    if (picview.length > 0) {
                      if (picview[0].currentSrc !== '')
                        window.location.href = picview[0].currentSrc;
                      else
                        window.location.href = picview[0].src;
                      break;
                    }
                  }
                } else if (xmlhttp.status == 400) {
                  console.log('There was an error 400');
                } else {
                  console.log('something else other than 200 was returned');
                }
              }
            };
 
            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Cache-Control", "max-age=0");
            //xmlhttp.setRequestHeader("Sec-Fetch-Dest", "document");
            //xmlhttp.setRequestHeader("Sec-Fetch-Mode", "navigate");
            //xmlhttp.setRequestHeader("Sec-Fetch-User", "?1");
            xmlhttp.setRequestHeader("Upgrade-Insecure-Requests", "1");
            xmlhttp.send(formData);
            //alert("request success");
          }
        }
      }
    },

    Kek = {
      domains: [/kek*\.com/],
      call: function (url) {
        let newlink = /"(https?:[\/a-zA-Z0-9\.]+data_server_new[^"]+)"/.exec(document.body.innerHTML);
        if(newlink !== null)
          window.location.href = newlink[1];
      }
    },

    shop = {
      domains: [/\.shop/],
      call: function (url) {
        for (let main of document.getElementsByClassName('main-content-box')) {
          for (let script of main.getElementsByTagName('script')) {
            let imglink = (script.textContent.match(/\s*imgbg.src\s*=\s*"([^"]+)"/) ? RegExp.$1 : '');
            if ('' !== imglink) {
              window.location.href = imglink;
              return;
            }
          }
        }
      }
    },

    Pinterest = {
      domains: ["pinterest"],
      call: function (url) {
        let id = (url.match(/pin\/(\d+)/) ? RegExp.$1 : '');
        if ('' === id) {
          alert("not found pin");
          return;
        }
        let data = JSON.parse(__PWS_DATA__.textContent);
        window.location.href = data.props.initialReduxState.pins[id].images.orig.url;
      }
    },

    PinterestImage = {
      domains: [/pinimg\.com/],
      call: function (url) {
        let newlink = url.replace(/pinimg\.com\/[^\/]+\//, "pinimg.com/originals/");
        window.location.href = newlink;
      }
    },

    PixsenseNet = {
      domains: [/pixsense\.net/],
      call: function (url) {
        let id = /pixsense.net\/([^\?\/]+)/.exec(url);
        if(id.length > 0)
          window.location.href = "http://www.imgfile.net/" + id[1];
      }
    },

    ImgNet = {
      domains: [/imgfile\.net/, "imgsee", "imgtigr", /\.buzz/,],
      call: function (url) {
        let scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length ; ++i) {
          let realPath = /document.getElementById\("(?:soDaBug|newImgE)"\).src = "([^"]+)"/gm.exec(scripts[i].innerText);
          if (realPath !== null) {
            window.location.href = realPath[1];
            break;
          }
        }

//      var imgParent = document.getElementsByClassName('big_img_box');
//      if(imgParent.length > 0)
//      {
//        let img = imgParent[0].getElementsByTagName('img');
//        if(img.length > 0)
//          window.location.href = img[0].src
//      }

//      let newlink = document.getElementById("myUniqueImg").getAttribute("src");
//      window.location.href = newlink;
      }
    },
/*
    javball = {
      domains: ["javball", /cnxx\.me/, /porn4f\.com/, "cnpics"],
      call: function (url) {
        for (let i of document.getElementsByClassName('fileviewer-file')) {
          for (let img of i.getElementsByTagName('img')) {
            Download(img, img.title.replace(/[^-]+-/, ''));
          }
        }
      }
    },
*/
    cnxx = {
      domains: ['javball', 'cnxx.me', 'porn4f.com', 'cnpics', '555fap.com', /18\.pics/, /69/, 'ovabee'],
      call: function (url) {
        for (let dom of document.getElementsByClassName('fileviewer-file')) {
          for (let img of dom.getElementsByTagName('img')) {
            window.location.href = img.src;
          }
        }
      }
    },

    bgremove = {
      domains: ['bgremove'],
      call: function (url) {
        window.location.href = url.replace(/\/image\/[^\/]+\/(\w+\/\w+\.(\w+))/, '/image/f=$2\/$1');
      }
    },

  ];

  let start = function()
  {
    let domain = window.location.host;
    let url = document.location.href;

    // page open failed
    if(typeof(loadTimeData) !== "undefined") {
      domain = loadTimeData.data_.summary.hostName;
      url = loadTimeData.data_.summary.failedUrl;
    }

    for(let module of modules) {
      if (module.domains.some(t => domain.match(t))) {
        module.call(url);
        break;
      }
    }
/*
    // test code
            let link = document.location.href,
            target_list = ["/videos", "/playlist", "video/search",];
        if (link.includes("viewkey")) {
            setLink();
        } else if (target_list.some(t => link.includes(t))) {
            reDirect(link);
        } else {
            replaceLink(".usernameWrap");
        }


let type1 = {
  domains: ["a.com", "b.*m", "c.com",],
  call : function (domain) {
    console.log("call type1 : " + domain);
  }
};

let type2 = {
  domains: ["a.net", "b.net", "c.net",],
  call : function (domain) {
    console.log("call type2 : " + domain);
  }
};

let modules = [type1, type2,];
let link = "bdfm";

for(let module of modules) {
if (module.domains.some(t => link.match(t))) {
  module.call(link);
  break;
} else {
  console.log("not detected");
}
}

    if (weibo.domains.some(t => domain.match(t))) {
      weibo.call(link);
    } else if (type2.domains.some(t => domain.match(t))) {
      type2.call(link);
    } else {
      console.log("not detected");
    }
*/

  }

  start();
})();