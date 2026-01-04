// ==UserScript==
// @name:zh-CN         油猴脚本API使用方法示例
// @name      Example of how to use Tampermonkey API
// @namespace    https://greasyfork.org/zh-CN/users/856508
// @version      0.1
// @description:zh-CN  这是一个用于油猴脚本函数用法的测试脚本，请打开网站"https://www.example.com"进行测试
// @description  This is a test script for the usage of Tampermonkey API functions, please open the website "https://www.example.com" to test it
// @author       waahah
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAATlBMVEUAAADxPTfwPTbwPTfwQDjwPTbxPTf////vAAD+9vb3r6771NT+7u71mJbyYF3wKB3xUEvzcG32oqD6ysr83t7/QDrzgH74vbz0iYbvGQRgrO+SAAAABnRSTlMAwYXtIXr9IU7BAAADFklEQVRYw6SQi3KjMAxF86qvLFmyMRSS///RFWzabBIT0u2BGY8x91jSbuF02B/DjzjuP067bw7h8zP8EE8cvvL7dnrbsb/lf2M4eP6/Dd7FKfyK0+7jVQHl+jprJfgE1sOZFvK6w6dwXIl7ONhZa9WzhVnS5rgLTYg6logrUbhzX5OWoFDWAUDquapW7hOAQTO9KciknhA1G3lhNFNxn1J+R0AmwGQdD/hm4M4mQIy2BCWQRkgZ5at9fxZkLIKotFUBTYAGQQMJCkz0UlCoR7QRiHgkAhgtoqdXAmKkwFiFSwTTuoAU0fMv4BChtCbIFmGMl7AhWl4RkEDP2OBcIdQWkEICtohFoNQU5AQTbCKGlFsCUvRj+1LcMfZQagkGdII3kA5DQ5D9swHxCq4LEEUk4Z8TmF+VnwTEqAxwtlKK5YFpXnqIEVGokOsBA1zB9CwQdANQ6TJvSPyXTNQjXEJXAvVCc+ZCFRg6yLMgpGQRkEm9OuZUKdjEybstsRLVxOx96iRAtJSeZpAN0sFZ5G6qlMe/O8NEl+q5pcyZTmD5QUBnTIqZ3gXpWzBQoQkpudJvpR4zOuFMjwIF870gGNeEcimkHr8JIpihT4IKZcQ7wTJECVQoyE3gsKK2BI8V+PjFc39KL7cVhkEYDF+MznpYTVqn9v1fdCphskK0LN4KQXP6vz+u7fP9BRRg+gUfqYmThzX/vKB/YZ5EjKhNyYeeJLGX8VoFvzrbA3BlpEa6VCEZq59wuuMnADUS08otgP9WIauSQtxqjpXzLQC1MjdMWh0nQA3gAbYyRC5Xba6d4ADOEkDTMDHjXA5N8XeeXR3nfsGMs3yhyFdaTR3aWw9wnlvrYdPztR7KA1hhMRJhadKGM2lDkjZWXMfiaIAXV8ILDftYnNM6IpQKGBg1k7+IM8CA2tFqBx5xzDphpLYAA0YKoVWHrK1D1hzzDrxiHh4M5nGgGXbEbNrJiHu4CZqUCEJdm8zrZZIdoy4P207RcSPYfjBm4S7uyw3H8hY4nud7EZsuqe2TGk+59ZWbb7L/y9/2/wOlynwXJBnZtgAAAABJRU5ErkJggg==
// @match        example.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @resource     avatar01 https://api.multiavatar.com/avatar01.svg
// @resource     include-page https://www.xbext.com/download/test-inc.html
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @grant        GM_cookie
// @license      GPL-3.0-or-later
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/520259/Example%20of%20how%20to%20use%20Tampermonkey%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/520259/Example%20of%20how%20to%20use%20Tampermonkey%20API.meta.js
// ==/UserScript==

(function () {

  var listener_id;
  var note = `<div id="note" style="text-align: center;width: 340px;margin: 0 auto; background: #d0d7de;font-size: 16px;line-height:1.5;">
                <p>The script has been run, please open the page tools menu (you can find it in the top right corner of XBrowser or in the main menu "Toolbox" option) to start running  test entries</p>
                </div>
                <div id="insert-page">
                </div>
                <div style="text-align: center">
                  <img id="avatar" src="https://via.placeholder.com/150"/>
                <div>
                `;

  $("body").append(note);


  GM_registerMenuCommand("🔷 GM_addStyle", function () {
    GM_addStyle('#note{color: white; background: #3385ff!important;border-bottom: 1px solid #2d7');
  });



  GM_registerMenuCommand("🔷 GM_openInTab1", function () {

    GM_openInTab("https://www.xbext.com")

  });

  GM_registerMenuCommand("🔷 GM_openInTab2", function () {

    GM_openInTab("https://www.xbext.com", false);

  });

  GM_registerMenuCommand("🔷 GM_getResourceText", function () {
    $("#insert-page").append(GM_getResourceText("include-page"));
  });

  GM_registerMenuCommand("🔷 GM_getResourceURL", function () {
    // alert(GM_getResourceURL("avatar01"));
    $("#avatar").attr("src", GM_getResourceURL("avatar01"));
  });

  GM_registerMenuCommand("🔷 GM_download1", function () {
    GM_download("https://www.xbext.com/download/xbrowser-release.apk");
  });

  GM_registerMenuCommand("🔷 GM_download2", function () {
    GM_download("https://www.xbext.com/download/xbrowser-release.apk", "xbrowser.apk");
  });

  GM_registerMenuCommand("🔷 GM_download3", function () {
    let urls = ["https://www.dundeecity.gov.uk/sites/default/files/publications/civic_renewal_forms.zip",
      "https://www.dundeecity.gov.uk/sites/default/files/publications/civic_renewal_forms.zip",
      "https://www.dundeecity.gov.uk/sites/default/files/publications/civic_renewal_forms.zip",
    ];
    var i = 0;
    for (let url of urls) {
      GM_download({
        url: `${url}`,
        name: `test-file${++i}.zip`,
        headers:{
            Referer:"https://www.example.com/"
        },
        onload: function() {
          console.log("download completed !");
        },
        tag: "test-file" /* 此属性为 x的扩展，在下载目录中创建名字为tag的子目录中统一保存 */
      });
    }

  });
  GM_registerMenuCommand("🔷 GM_setValue", function () {
    GM_setValue("foo", "bar");
    GM_setValue("count", 100);
    GM_setValue("active", true);
    GM_setValue("data", {
      name: 'Andy',
      age: 18
    });

    alert("You executed the GM_setValue method, please run the GM_getValue method to see the result");

  });

  GM_registerMenuCommand("🔷 GM_getValue", function () {

    var info = `foo = ${GM_getValue("foo")}
          count = ${GM_getValue("count")}
          active = ${GM_getValue("active")}
          data.name =  ${GM_getValue("data").name}`;
    alert(info);

  });

  GM_registerMenuCommand("🔷 GM_addValueChangeListener", function () {

    listener_id = GM_addValueChangeListener("foo", function (name, old_value, new_value, remote) {
      alert("Value Changed:" + name + ":" + old_value + "=>" + new_value);
    });
    GM_setValue("foo", "newbar");


  });

  GM_registerMenuCommand("🔷 GM_removeValueChangeListener", function () {
    if (listener_id) {
      GM_removeValueChangeListener(listener_id);
      alert("remove a value change listener [" + listener_id + "]");
    }

  });

  GM_registerMenuCommand("🔷 GM_listValues", function () {
    GM_setValue("k1", "v1");
    GM_setValue("k2", "v2");
    GM_setValue("k3", "v3");
    alert(GM_listValues());

  });

  GM_registerMenuCommand("🔷 GM_deleteValue", function () {
    GM_deleteValue("data");
    alert(GM_listValues());

  });


  GM_registerMenuCommand("🔷 GM_notification_1", function () {
    GM_notification("Hello!");
  });

  GM_registerMenuCommand("🔷 GM_notification_2", function () {
    GM_notification({
      text: 'This is a message with callback',
      onclick: function () {
        alert("you click message ok button");
      },
      ondone: function () {
        alert("message bar closed");
      }
    });

  });
  GM_registerMenuCommand("🔷 GM_notification_3", function () {
    GM_notification("Hello", "", "", function () {
      alert("you click message ok button");
    })

  });


  GM_registerMenuCommand("🔷 GM_Http_get", function () {
    GM_xmlhttpRequest({
      url: "http://www.example.com",
      method: "GET",
      onload: function (response) {
        // alert(response.responseText);
        console.log(response.responseText);
      }
    });
    GM_xmlhttpRequest({
      url: "http://www.example.com",
      method: "GET",
      onload: function (response) {
        alert(response.responseText);
        console.log(response.responseText);
      }
    });

  });

  GM_registerMenuCommand("🔷 GM_Http_read_stream", function () {
    GM_xmlhttpRequest({
      url: "https://www.xbext.com/download/test.txt",
      method: "GET",
      responseType: "stream",
      onload: function (response) {
        var reader = response.response;
        reader.ondata = function (chunk) {
          var decoder = new TextDecoder(); // 创建 TextDecoder 对象
          var data = decoder.decode(chunk); // 将字节数据转换为字符串
          console.log("Received chunk of size: " + chunk.length);
          console.log("Received data: " + data);
        };

        reader.onend = function () {
          console.log("Finished receiving data.");
        };


      }
    });

  });

  function readData(reader) {
    reader.read().then(function (result) {
      if (!result.done) {
        // 处理数据块
        var chunk = result.value;
        console.log("Received data chunk:", chunk);

        // 继续读取下一个数据块
        readData(reader);
      } else {
        // 数据流结束
        console.log("Data stream ended.");
      }
    }).catch(function (error) {
      // 处理错误
      console.error("Error reading data:", error);
    });
  }

  GM_registerMenuCommand("🔷 GM_Http_read_stream2", function () {
    GM_xmlhttpRequest({
      url: "https://www.xbext.com/download/test.txt",
      method: "GET",
      responseType: "stream",
      onload: function (stream) {
        var reader = stream.response.getReader();
        readData(reader);
      }
    });

  });



  GM_registerMenuCommand("🔷 GM_Http_post1", function () {
    GM_xmlhttpRequest({
      method: "POST",
      url: "http://www.example.net/login",
      data: "username=johndoe&password=xyz123",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function (response) {
        alert(response.responseText);

      },
      onerror: function (response) {
        alert("http code:" + response.status);
      }
    });

  });



  GM_registerMenuCommand("🔷 GM_Http_post2", function () {
    GM_xmlhttpRequest({
      url: "http://www.example.com/push",
      method: "POST",
      data: JSON.stringify({ "post-data": "this is test data" }),
      headers: {
        "Content-type": "application/json"
      },
      timeout: 3000,
      onload: function (response) {
        alert("http code:" + response.status);
      },
      onerror: function (response) {
        alert("http code:" + response.status);
      }
    });

  });


  GM_registerMenuCommand("🔷 GM_Http_post3", function () {
    GM_xmlhttpRequest({
      url: "http://192.168.32.223:8081",
      method: "POST",
      data: "this is test",
      headers: {
        "Content-type": "text/plain;charset=utf-8"
      },
      timeout: 3000,
      onload: function (response) {
        alert("http code:" + response.status);
      },
      onerror: function (response) {
        alert("http code:" + response.status);
      }
    });

  });

  GM_registerMenuCommand("🔷 urlchange", function () {
    window.addEventListener('urlchange', () => {
       alert("urlchange");
    });
    window.location = "#test"

  });


  GM_registerMenuCommand("🔷GM_cookie_set", function () {
    GM_cookie('set', {
      url: "https://www.example.com",
      domain: "example.com",
      name: "test",
      value: "test",
    }, function (result) {
        console.log(result);
    });
  });

  GM_registerMenuCommand("🔷GM_cookie_list", function () {
    GM_cookie('list', {

      domain: "www.xbext.com",

    }, function (result) {

        console.log(result);
    });

  });

  GM_registerMenuCommand("🔷GM_cookie_delete", function () {
      GM_cookie('delete', {
        url: "https://www.example.com",
        name: "test"
  
      }, function (result) {
          console.log(result);
      });

  });
  

  GM_registerMenuCommand("🔷 GM_info", function () {
    var info = "Script Name: " + GM_info.script.name +
      "\nVersion: " + GM_info.script.version +
      "\nVersion: " + GM_info.script.version +
      "\nScriptHandler: " + GM_info.scriptHandler +
      "\nScript Handler Version : " + GM_info.version;

    alert(info);

  });



})();

