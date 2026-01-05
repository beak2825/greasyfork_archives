// ==UserScript==
// @name Reporter - regulary
// @description ...
// @author tkafka
// @version 0.0.33
// @date 2017-04-07
// @namespace reporter.seznam.tomaskafka.com
// @match https://admin.reporter.seznam.cz/hive/transformation/*/regexp/*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/28765/Reporter%20-%20regulary.user.js
// @updateURL https://update.greasyfork.org/scripts/28765/Reporter%20-%20regulary.meta.js
// ==/UserScript==


(function (document) {
    if (window.location.pathname.match(/^\/hive\/transformation\/\d+\/regexp\/?/)) {
    	var $content = document.querySelector('#content');
    	var $table = $content.querySelector('table');
    	
    	if (!$table) { return; }
    	
    	var $trs = $table.querySelectorAll('tbody > tr');
    	
    	// REGULARY
    	var $content_p = $content.querySelector('p');
    	
    	var $sep = document.createTextNode(' | ');
		$content_p.appendChild($sep);
		
    	var $a = document.createElement('a');
    	$a.setAttribute('href', '#');
    	$a.textContent = 'Smazat všechny reguláry';
    	$content_p.appendChild($a);
    	
    	$a.addEventListener('click', function(e) {
    	    var result = window.confirm('Smazat všechny reguláry?');
    	    if (result) {
                // https://admin.reporter.seznam.cz/hive/transformation/1162/regexp/19542/-
            	var $links = $table.querySelectorAll('tbody a[href$="/-"]');
            	var linkCount = $links.length;
            	var remaining = linkCount;
                foreachSelector($links, function($link, i) {
                    var deleteUrl = $link.getAttribute('href');
                    console.log(deleteUrl);
                    
                    loadUrl(deleteUrl, function(deleteHtml) {
                       var csrfMatches = deleteHtml.match(/name="_csrf_token"\s+value="([^"]+)"/);
                       if (csrfMatches) {
                            submitForm(
                                deleteUrl, 
                                'confirm=1&_csrf_token='+csrfMatches[1]+'&submit=' + encodeURIComponent('Ano, odstranit regulární výraz'),
                                function(response) {
                                    remaining--;
                                    
                                    console.log(i, remaining + ' remaining');
                                    // console.log(i, response);
                                    
                                    if (remaining === 0) {
                                        console.log('All deleted ok :)');
                                        setTimeout(function() { window.location.reload(); }, 0);
                                    }
                                }
                            );
                       } else {
                           console.error('Did not find csrf token in ' + deleteUrl);
                       }
                    });
                    
                });
    	    }
            e.preventDefault();
            return false;
    	});
    	
        // TEXTAREAS

        var lines = [];
        var code = [];
        code.push('var regexes = [');
        
        foreachSelector($trs, function($tr, i) {
            var $tds = $tr.querySelectorAll('td');
            
            if ($tds.length >= 4) {
                var obj = {};
                obj.priority = parseInt($tds[0].textContent, 10);
                obj.regex = $tds[1].textContent.trim();
                obj.replacement = $tds[2].textContent.trim();
                obj.positive = $tds[3].textContent && $tds[3].textContent.trim().match(/^P/);
                
                lines.push(csvLine([
                    obj.regex,
                    obj.replacement,
                    obj.priority,
                    obj.positive ? 1 : 0
                ]));
                
                code.push('\trp(\n\t\t\''+obj.replacement+'\',\n\t\t/'+(obj.regex.replace(/\//g, '\\/'))+'/,\n\t\t'+obj.priority+', '+(obj.positive ? 1 : 0)+'\n\t),');
            }
        });
        code.push('];');
        
        appendTextarea($content, lines.join('\n'));
        appendTextarea($content, code.join('\n'));
    }

    function appendTextarea($parent, content) {
    	var $textarea = document.createElement('textarea');
    	$textarea.setAttribute('autocomplete', 'off');
    	$textarea.setAttribute('autocorrect', 'off');
    	$textarea.setAttribute('spellcheck', 'off');
    	$textarea.setAttribute('autocapitalize', 'off');
		$textarea.style.width = '100%';
		$textarea.style.height = '10em';
		
		$textarea.value = content;

		$parent.appendChild($textarea);

        // fix TA height
    	setTimeout(function(){
    		$textarea.style.height = (Math.round($textarea.scrollHeight) + 1) + 'px';
	    }, 0);
    }
	
	function foreachSelector($els, fn) {
	    if ($els.length > 0) {
			Array.prototype.forEach.call($els, fn);
		}
	}
	
    function loadUrl(url,callback) {
        var http=new XMLHttpRequest();
        http.open("GET", url, true);
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                callback(http.responseText);
            }
        }
        http.send();
    }	

    function submitForm(url, paramsStr, cb) {
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = paramsStr; // aaa=bbb&ccc=ddd ...
        http.send(params);
        http.onload = function() {
            cb && cb(http.responseText);
        }
    }	
	
	function escapeCsv(s) {
	    return '"'+s.replace(/\n/g,' ').replace(/"/g,'""')+'"';
    }
    
    function csvLine(array) {
        var sep = ';';
    	return array
    		.map(function(s) {
    			if (s === null) return '';
    			if (typeof s === 'object') return escapeCsv(JSON.stringify(s));
    			if (typeof s !== 'string') s = String(s);
    			if (s.indexOf(sep) > -1 || s.indexOf('"') > -1) {
    				return escapeCsv(s);
    			}
    			return s;
    		})
    		.join(sep);
    }

})(document);