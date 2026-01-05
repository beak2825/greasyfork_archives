// ==UserScript==
// @name        RYMSearchYourMusic
// @namespace   https://greasyfork.org/users/14256
// @description Search in YouTube the music that you are viewing in RYM
// @include     https://rateyourmusic.com/release/*
// @include     http://rateyourmusic.com/release/*
// @include     https://rateyourmusic.com/artist/*
// @include     http://rateyourmusic.com/artist/*
// @version     0.5.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11738/RYMSearchYourMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/11738/RYMSearchYourMusic.meta.js
// ==/UserScript==

/**
 * Function that removes the edges of a string
 * @param {string} str A String.
 * @return {string} The String without the first and last character.
 */
removeEdges = function(str){
  return str.slice(1,str.length - 1);
}

Location = {
  artistPage: function(){
    var location = window.location.href;
    var reg_ex = /\/artist/;
    var info = reg_ex.exec(location);
    if (info && (info.index == 25 || info.index == 24)){
      return true;
    }
    return false;
  }
};

Get = {
  artistAndReleaseInfo: function(artistPage) {
    var resultInfo = []
    if (artistPage) {
      resultInfo.push(this.getArtistNameOnArtistPage());
    } else {
      resultInfo.push(this.getArtistNameOnReleasePage());
      resultInfo.push(this.getAlbumName());
    }
    return resultInfo
  },
  getArtistNameOnArtistPage: function() {
    var header_name = document.getElementsByClassName("artist_name_hdr")[0];
    if (header_name.childNodes.length == 2){
      return header_name.childNodes[1].innerHTML;
    }
    return header_name.innerHTML
  },
  getArtistNameOnReleasePage: function() {
    var artistName = document.getElementsByClassName("artist")[0];
    if (artistName.childNodes.length == 2) {
      return removeEdges(artistName.childNodes[1].innerHTML);
    }
    return artistName.innerHTML;
  },
  getAlbumName: function() {
    return document.getElementsByClassName("album_title")[0].firstChild
      .textContent.trim(); 
  }
};

Button = {
  image: 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%18%00%00%00%18%08%06%00%00%00%E0w%3D%F8%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%03hiTXtXML%3Acom.adobe.xmp%00%00%00%00%00%3C%3Fxpacket%20begin%3D"%EF%BB%BF"%20id%3D"W5M0MpCehiHzreSzNTczkc9d"%3F%3E%20%3Cx%3Axmpmeta%20xmlns%3Ax%3D"adobe%3Ans%3Ameta%2F"%20x%3Axmptk%3D"Adobe%20XMP%20Core%205.3-c011%2066.145661%2C%202012%2F02%2F06-14%3A56%3A27%20%20%20%20%20%20%20%20"%3E%20%3Crdf%3ARDF%20xmlns%3Ardf%3D"http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23"%3E%20%3Crdf%3ADescription%20rdf%3Aabout%3D""%20xmlns%3AxmpMM%3D"http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2Fmm%2F"%20xmlns%3AstRef%3D"http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2FsType%2FResourceRef%23"%20xmlns%3Axmp%3D"http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2F"%20xmpMM%3AOriginalDocumentID%3D"xmp.did%3A2027C4D719206811822AB9CF09994492"%20xmpMM%3ADocumentID%3D"xmp.did%3A9E7A0DE040FB11E396A7E188B3ADD539"%20xmpMM%3AInstanceID%3D"xmp.iid%3A8151D0C240FB11E396A7E188B3ADD539"%20xmp%3ACreatorTool%3D"Adobe%20Photoshop%20CS6%20%28Macintosh%29"%3E%20%3CxmpMM%3ADerivedFrom%20stRef%3AinstanceID%3D"xmp.iid%3A0977346250206811822A8DFBC8CA3F44"%20stRef%3AdocumentID%3D"xmp.did%3A2027C4D719206811822AB9CF09994492"%2F%3E%20%3C%2Frdf%3ADescription%3E%20%3C%2Frdf%3ARDF%3E%20%3C%2Fx%3Axmpmeta%3E%20%3C%3Fxpacket%20end%3D"r"%3F%3E%C1%87%E7%04%00%00%03DIDATx%DA%94U%CDK%5BA%10%9FM%5E%B4%29%89Il%AD%10%03%F1j%40%0F%BDT%BC%7B%A8%BD%F4R%2CX%D0%08%ED%AD%87x%B2%D0C%ED%3F%204%D0S%ED%1F%D0c%2F%A5G%3D%144%94%12%5B%2A%82%3DH%13%A8%20Z%10%F3%85%D9%E9%EC%EC%BE%F76%C9%8B%D6%D5%CD%DB%D9%9D%CF%DF%CC%CE%8A%A9%A9I%00%104a%96%E6%7D%00%BCm%E8%8E%81%10%B4%DB%CD%C4%5C%27%C4%F8%B9%5C.%7FR%5BbrrR%09%BEA%10%CF%99%89%08%81Z%25%FA%849%12l%C9%9C%D0%86%D0%3A%8D%0B%82it%99%DF%ED%96w%9F%2A%03%8Fh%EB%83%B8%D2%E3%E0%18%94%3E%11%10%9A%E1%5E%0C%DF%19%1D%7D%2B%10%C7%DDM_%89O%A1%D0%A4R%C4%0A%E9%0F%A1%9F%84-%04%19%07P%DE%92z%87%D1%D0%E1k%11%CD%83%BC%40%D7%5B%C5%81%FE%99%FAH"%7C%E3%16%84%001G"%B4%3C%7F8.d%2A%95JA%F4F%14%A27%A3%E08%0E%C4b%F1%0E%28%CE%CE%CE%E0%E2%E2%02j%F5%3A4ju8%FD%7B%EA%AB%96%CA%01%D6%D9pTV%D0%C2.3%96%81%F5%F5u%C8f%B3p%9Dqxx%08%85B%01%2A%95%AA%17%B5r%3C%C4%E1%EA%1F%FE%E6%F3%F9k%2BWC%C9%2C%E7%97I%A5%E48%08z%82%0EA%E5%80%19%A4%C9N.%97%83%CE%98%FE%7FL%E4%26%B4%F3%88%5E%CD%85%24%9A%A4q%0E%24%24%12%89%40%E1%8D%8D%F7%B0%B9%B9y%A9%81d2I%FEJm%C0%18%09%E9Z%90%1EL%03%03%11%9F%C1%9A%07%BF%0E%A0%B0%B2%02O%16%16%60%7B%7B%3B%90%27%12q%08%16%9DjF%85%8C%85%90v%A4%D4%25%A4%0E%D5%3AH%D8H%C2%CF%BD%3DX%7B%B5%06%FB%FB%FB%C1%7C%28%B5.%A9iG%C1%82n%0D%A3%F0%19%BB%86J%5D"1%04%8BKK%F0x~%9E%BC%8D%F4%F0%B1%1F%0A%7B%89%BA%DCI%9F%A3%04%85%E4%EB%C3%B5%5B%AF%D7%20%1E%8F%F5%18x07%07%2FVW%E9%2C%DE7%07%B5Z%CDC%82o%3E%99s%F4%86%7B%7B%11%8E%8F%8Fadd%A4Gxff%C6x%D9%BF%C2%94%AC%82%C6t%16v%3A%A4%B1%026%A2%E0%2B%95J%81%D8%FE%CF%2C%ED%ECp%C1H%93%07e"%9CL%A6%9E%11%40i%E4%16%81%F0c%F7%3B%A4%86%87app%90%BDj%B7%DB%8Cw%D08%3F%3F%E7ytt%04%5B%5B%5BP%2C%16%A1%D5jy%5D%91%FE%FF%88lv%FC%2BQw%AD6%D8g%29%B8%84C%E1%104%1B%0D%B8%EC.Z%A2%DF%D4M%8EX%7D%B1%93%01%ED%DE%8E%D0l6%83%95%B9%ED%DC%AB8%EFl%80%BA%29%D6%BB%FB%BF%F4H_%D2%F6X%B71%F4%B5%23zo%81%F5%8A%A8u3%3C%94H%A4%88a%D6%86%C2U%EA%F6~%D3%FC%ADX%8C%1A%EFi%05%AF%0AQ%F8%DE%D0%AA%28%C62c%AA%5D%7C%A1%93%7BJ%82%2F%1B%A0%25%E0%DA3%EF%B3%EB%AA%10%9E9%C0%EE%D7%8C%3F%25%D22%ED%80%BE%17%D3d%F55m%3E%24%95%C3%FA%C5%92%DE%23%DFQ%FF%A6M%A2t%A1C%1F4%F6%1EN%E8%F7%E3%EFJ%E5%25%DBK%A7%D3%DDi%0B%5B%FE%F4%D6%C5%15%A3Z%AD%B6m%FA%9F%00%03%000%3B%3F%87%BF%2A%8A%3C%00%00%00%00IEND%AEB%60%82',
  putButton: function(artistAndReleaseInfo) {
    if (artistAndReleaseInfo && artistAndReleaseInfo.length == 1){
      this.putButtonArtistPage(artistAndReleaseInfo);  
    } else if ( artistAndReleaseInfo && artistAndReleaseInfo.length == 2 ){
      this.putButtonReleasePage(artistAndReleaseInfo);
    }
  },
  putButtonArtistPage: function(artistAndReleaseInfo) {
     document.getElementsByClassName("artist_name_hdr")[0]
      .appendChild(this.createButton(artistAndReleaseInfo));
  },
  putButtonReleasePage: function(artistAndReleaseInfo) {
    var textNodeRelease = document.getElementsByClassName("album_title")[0]
                            .firstChild; 
    textNodeRelease.parentNode.insertBefore(this.createButton(artistAndReleaseInfo),
                                              textNodeRelease.sibling);
  },
  createButton: function(artistAndReleaseInfo) {
    var newAElement = this.anchorElement(artistAndReleaseInfo);
    var imageElement = this.imageElement(artistAndReleaseInfo);
    newAElement.appendChild(imageElement);
    return newAElement
  },
  anchorElement: function(artistAndReleaseInfo) {
    var newAElement = document.createElement('a');
    newAElement.href = this.generateLink(artistAndReleaseInfo);
    if (artistAndReleaseInfo.length == 1) {
      newAElement.style = "padding-left: 5px;"
    }
    return newAElement
  },
  imageElement: function(artistAndReleaseInfo) {
    var imageElement = document.createElement('img');
    imageElement.src = this.image;
    if (artistAndReleaseInfo.length == 1) {
      imageElement.style = "height: 22px; width: 22px;"
    } else {
      imageElement.style = "height: 18px; width: 18px;"
    }
    return imageElement
  },
  generateLink: function(artistAndReleaseInfo) {
    var queryLink = 'https://www.youtube.com/results?search_query=';
    var query = "";
    for (var i = 0, len = artistAndReleaseInfo.length; i < len; i++) {
      query += this.obtainValidString(artistAndReleaseInfo[i]);
      query += "+";
    }
    return (queryLink+query);
  },
  obtainValidString: function(str){
    return str.toLowerCase().replace(/&amp;/,"%26").replace(/&/g,"%26")
              .replace(/ /g,"+"); 
  }
};

Button.putButton(Get.artistAndReleaseInfo(Location.artistPage()));
