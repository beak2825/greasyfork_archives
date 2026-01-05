function curl(url, method, data, success){
  GM_xmlhttpRequest({
    url:    url,
    method: method,
    data:   data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    onload: success
  });
}

function userStyle(css){
    var node  = document.createElement('style'),
        heads = document.getElementsByTagName('head');

    node.type = 'text/css';
    node.appendChild( document.createTextNode(css) );
    
    if (heads.length > 0)
        heads[0].appendChild(node);
    else
        document.documentElement.appendChild(node);
}

function link(href){
    curl(href, 'GET', null, function(response){
      userStyle(response.responseText);
    });
}
