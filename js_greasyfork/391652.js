// ==UserScript==
// @name         Website banner alert
// @namespace    https://namnv609.cf/
// @version      0.1
// @description  Show alert banner to some specific websites
// @author       NamNV609
// @connect      api.sheety.co
// @match        https://*/*
// @match        http://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391652/Website%20banner%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/391652/Website%20banner%20alert.meta.js
// ==/UserScript==

(function() {
  /**
   * Method mã hóa dữ liệu sang dạng MD5
   * https://stackoverflow.com/a/33486055
   */
  var MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_};

  /**
   * Một method đơn giản để loại bỏ HTML tag
   * phòng trường hợp message có chứa các thẻ HTML :D
   */
  String.prototype.htmlSafe = function() {
    return this.valueOf().replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
  };

  /**
   * Một method đơn giản là convert object sang CSS string
   * Method này dành cho GM_addStyle
   */
  var objToCSS = function(selectorName, cssObj) {
    var cssStr = selectorName + " {";

    for (var key in cssObj) {
      var cssProperty = key.replace(/[A-Z]/g, function(match) {
        return "-" + match.toLowerCase();
      });
      cssStr += cssProperty + ":" + cssObj[key] + ";";
    }

    return cssStr + "}"
  };

  /**
   * Một số constant
   */
  var API_URL = "https://api.sheety.co/0a862fa7-7eaa-4671-b34a-025ba3f68a93";
  var EXT_KEY_PREFIX = "TAMPERMONKEY_WEBSITE_BANNER_ALERT_";
  var SITES_KEY = EXT_KEY_PREFIX + "SITES";
  var IS_CORRECT_DOMAIN_KEY = EXT_KEY_PREFIX + "IS_CORRECT";
  var LAST_UPDATE_SITES_KEY = EXT_KEY_PREFIX + "LAST_UPDATE";
  var ALERT_MESSAGE_KEY = EXT_KEY_PREFIX + "ALERT_MESSAGE";
  var HISTORY_UPDATE_STATE_KEY = EXT_KEY_PREFIX + "HISTORY_STATE_UPDATE";
  var FORCE_UPDATE_URLS_KEY = EXT_KEY_PREFIX + "FORCE_UPDATE_URLS";
  var MILISEC_PER_HOUR = 36e5; // 60 * 60 * 1000
  var HOURS_TO_UPDATE = 3;
  var ALERT_MESSAGE_ELEMENT_ID = "tampermonkey-website-banner-alert-message";

  /**
   * Add style cho alert message
   */
  GM_addStyle(objToCSS("#" + ALERT_MESSAGE_ELEMENT_ID, {
    width: "100%",
    position: "fixed",
    padding: "10px",
    border: "1px solid #000",
    backgroundColor: "#F00",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: "36px",
    textAlign: "center",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 100000
  }));
  GM_addStyle(objToCSS("#" + ALERT_MESSAGE_ELEMENT_ID + " #close-alert-message", {
    position: "absolute",
    right: "30px",
    top: "10px",
    fontSize: "16px",
    cursor: "pointer"
  }));

  /**
   * Cập nhật (init) danh sách các URL
   */
  function fetchData() {
    GM_xmlhttpRequest({
      url: API_URL,
      method: "GET",
      responseType: "json",
      onload: function(responseData) {
        if (responseData.readyState === 4 && responseData.status === 200) {
          // Lưu dữ liệu đã lấy được vào local storage để dùng dần :v
          GM_setValue(SITES_KEY, JSON.stringify(responseData.response));
          GM_setValue(LAST_UPDATE_SITES_KEY, new Date().getTime());

          /**
           * Xóa session isCorrectDomain đã lưu (nếu có) để cập nhật lại
           * Phòng trường hợp trang này trước đáy không được hiển thị nhưng
           * sau khi update xong lại cần được hiển thị message
           */
          sessionStorage.removeItem(IS_CORRECT_DOMAIN_KEY);
        }
      }
    });
  }

  /**
   * Kiểm tra xem domain hiện tại có nằm trong danh sách cần hiển thị hay không
   * Nếu đúng thì set session để lần sau đỡ mất công kiểm tra lại :D
   */
  function checkIsCorrectDomain() {
    var sitesData = GM_getValue(SITES_KEY);

    if (sitesData) {
      var isCorrectDomain = false;
      var currentHostName = MD5(window.location.hostname.replace(/^w{3}\./g, ""));
      var alertMessage = "";

      sitesData = JSON.parse(sitesData);

      for (var idx in sitesData) {
        var siteData = sitesData[idx];

        if (siteData.url === currentHostName) {
          isCorrectDomain = true;
          alertMessage = siteData.message;

          break;
        }
      }

      sessionStorage.setItem(IS_CORRECT_DOMAIN_KEY, isCorrectDomain);
      sessionStorage.setItem(ALERT_MESSAGE_KEY, alertMessage.htmlSafe());

      showAlertMessage();
    } else {
      fetchData();
    }
  }

  /**
   * Kiểm tra để cập nhật lại danh sách các URLs cần hiển thị alert
   */
  function checkForUpdate() {
    var lastUpdatedAt = GM_getValue(LAST_UPDATE_SITES_KEY);
    var currentTime = new Date().getTime();
    var hoursSince = Math.abs(currentTime - lastUpdatedAt) / MILISEC_PER_HOUR;

    if (hoursSince > HOURS_TO_UPDATE) {
      fetchData();
    }
  }

  function showAlertMessage() {
    clearOldAlertMessages();

    var isCorrectDomain = sessionStorage.getItem(IS_CORRECT_DOMAIN_KEY);

    /**
     * Nếu trang hiện tại chưa có session là domain này có cần hiển thị hay không
     * thì thực hiện gọi hàm kiểm tra và set session cho phiên làm việc hiện tại
     */
    if (isCorrectDomain === null) {
      checkIsCorrectDomain();
    }

    /**
     * Thực hiện kiểm tra xem domain hiện tại có cần hiển thị hay không
     * Nếu đúng thì thực hiện hiển thị message
     */
    if (isCorrectDomain == "true") {
      var messageElement = document.createElement("DIV");
      var closeMessageElement = document.createElement("SPAN");

      messageElement.id = ALERT_MESSAGE_ELEMENT_ID;
      messageElement.innerHTML = sessionStorage.getItem(ALERT_MESSAGE_KEY);

      closeMessageElement.id = "close-alert-message";
      closeMessageElement.innerText = "×";
      closeMessageElement.addEventListener("click", function(evt) {
        if (confirm("Bạn có thực sự chắc chắn muốn đóng message cảnh báo này?".toUpperCase())) {
          messageElement.parentNode.removeChild(messageElement);
        }
      });

      messageElement.appendChild(closeMessageElement);
      document.body.appendChild(messageElement);
    }
  }

  /**
   * Xóa những alert messages trước đó (nếu có)
   */
  function clearOldAlertMessages() {
    var oldAlertMessageElement = getAlertMessageElementId();

    while(oldAlertMessageElement) {
      oldAlertMessageElement.parentNode.removeChild(oldAlertMessageElement);
      oldAlertMessageElement = getAlertMessageElementId();
    }
  }

  function getAlertMessageElementId() {
    return document.getElementById(ALERT_MESSAGE_ELEMENT_ID);
  }

  /**
   * Thực hiện kiểm tra cập nhật dữ liệu mới nhất từ API
   */
  checkForUpdate();

  /**
   * Hiển thị message. Nếu có
   */
  showAlertMessage();
})();
