function addScript(url){
    var s = document.createElement('script');
    s.setAttribute('src',url);
    document.body.appendChild(s);
}

// video download
addScript('https://cdn.jsdelivr.net/gh/xsyhnb/tool/bilibilitools.js');