// ==UserScript==
// @name            E-Hentai Grep
// @description     Searches forum posts for lines that match given string patterns
// @include         http://forums.e-hentai.org/index.php?*showtopic=*
// @version 0.0.1.20161218195054
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/5440/E-Hentai%20Grep.user.js
// @updateURL https://update.greasyfork.org/scripts/5440/E-Hentai%20Grep.meta.js
// ==/UserScript==

/*** Settings ***/

var default_on = true
var hotkey = 71 // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
var max_length = 60
var display_title_and_poster = false
var remove_stockout_line = true
var remove_strike_through_line = true
var remove_quoted_text = true
if(typeof result_box_position == 'undefined') {
    var result_box_position = 'left' // where to show the result box ("left", "center" or "right")
}
var blacklist = [
    '22234', // Ask the Experts
    '163637', // The Shared Free Shop
    '169987',
    '170830',
]
if(typeof grep_patterns == 'undefined') {
    var grep_patterns = [ // Add [[pattern_1, pattern_2, ... , pattern_n], 'color'] to the array by yourself.
        [ // Items
            [
                // rare mats
                ///(((^|\s)\b)|x)phazon/i,
                
                // bindings for staff
                ///(((^|\s)\b)|x)binding.*(slaughter|destruction|focus|friendship|heimdall|fenrir|heaven-sent|demon-fiend|curse-weaver|earth-walker|fox|owl)/i,
                ///^\s*(slaughter|destruction|focus|friendship|heimdall|fenrir|heaven-sent|demon-fiend|curse-weaver|earth-walker|fox|owl)/i,
                
                // bindings for staff (selected stats)
                ///(((^|\s)\b)|x)binding.*destruction/i,
                ///^\s*destruction/i,
                
                // bindings for cloth armor
                ///(((^|\s)\b)|x)binding.*(destruction|balance|focus|protection|warding|fleet|negation|heimdall|heaven-sent|dampening|cheetah|raccoon|fox|owl)/i,
                ///^\s*(destruction|balance|focus|protection|warding|fleet|negation|heimdall|heaven-sent|dampening|cheetah|raccoon|fox|owl)/i,
                
                // bindings for cloth armor (selected stats)
                ///(((^|\s)\b)|x)binding.*(protection|fleet|heaven-sent|raccoon|cheetah|fox|owl)/i,
                ///^\s*(protection|fleet|heaven-sent|raccoon|cheetah|fox|owl)/i,
                
                // graded mats
                ///(((^|\s)\b)|x)(high)[-\s]*grade\s*(cloth)/i,
                ///(((^|\s)\b)|x)(hg)[-\s]?(cloth)/i,
                /(((^|\s)\b)|x)scrap\s*(cloth).*@/i,
                /(((^|\s)\b)|x)scrap\s*(cloth).*\d *c\b/i,
                /(((^|\s)\b)|x)scrap\s*(cloth).*\b\d{2}\b/i,
                
                // catalysts
                ///(((^|\s)\b)|x)catalyst/i,
                
                // shards
                ///(((^|\s)\b)|x)(amnesia|aether|ether)\b/i,
                
                // ed & artifact
                /(((^|\s)\b)|x)(energy|drink|(artifact|artefact)).*[@0]/i,
                /(((^|\s)\b)|x)(energy|drink|(artifact|artefact)).*\d *k\b/i,
                /(((^|\s)\b)|x)(energy|drink|(artifact|artefact)).* *\d+/i,
                
                // restoratives
                /(((^|\s)\b)|x)health.*elixir/i,
                /(((^|\s)\b)|x)spirit.*(potion|elixir)/i,
                /(((^|\s)\b)|x)last.*elixir/i,
                
                // powerups
                /(((^|\s)\b)|x)(vase|bubble)/i,
                
                // infusions & scrolls
                ///(((^|\s)\b)|x)(infusion|(scroll of))/i,
                
                // foods
                /(((^|\s)\b)|x)(packs?\b|chow|edible|cuisine|pill)/i,
                
                // trophies
                ///(((^|\s)\b)|x|\{)noodl/i,
                ///((^|\s)\b)(troph|manbearpig|antioch|mithra|dalek|lock|costume|hinamatsuri|broken|sapling|shirt|unicorn|noodl)/i,
            ], 'purple', ''
        ],
        [ // Divine
            [
                /(Peer|Leg).*Hallowed.*Katalox.*(Destruction|Heaven-sent)/i,
                /(Peer|Leg).*Charged.*Heimdall/i,
                /(Peer|Leg).*(Charged|Frugal).*Heaven-sent/i,
            ], 'darkred', ''
        ],
        [ // Elemental
            [
                /Peer.*(Tempestuous|Shocking|Arctic|Fiery).*(Willow|Redwood)/i,
                /Leg.*(Tempestuous|Shocking).*Willow.*(Destruction|Focus)/i,
                /Leg.*(Arctic|Fiery).*Redwood.*Destruction/i,
                /(Peer|Leg).*(Charged|Frugal).*(Freyr|Mjolnir|Niflheim|Surtr|Elementalist|Curse-weaver)/i,
            ], 'darkgreen', ''
        ],
        [ // Toys
            [
                /(Peer|Leg).*Buckler.*(Barrier|Battlecaster)/i,
                /(Peer|Leg).*(Ethereal|Hallowed|Tempestuous|Shocking|Arctic|Fiery).*Waki.*(Nimble|Battlecaster)/i,
                /(Peer|Leg).*Gossamer/i,
                /Peerless/i,
            ], 'darkblue', ''
        ],
    ]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(!/&?\bst=[^0]/.test(href)) {
    for(var i=0; i<blacklist.length; i++) { if(new RegExp('showtopic=' + blacklist[i] + '\\b').test(href)) { default_on = false } }

    var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
    var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

    var stockout = function(line) {
        if(!remove_stockout_line) { return false }
        var stockout_patterns = [
            /[\|\(\[【（:x@]\s*[-0x×\/]+(\D|$)/i,
            // /(^|\D)[-0x×\/]+\s*[@×x:）】\]\)\|]/i,
            /(^|\D)[-0×\/]+\s*[@×:）】\]\)\|]/i,
            /(^|[^,])\b0+\s*[x×]/i,
            /(^|\s+)0+\s+/i,
            /-\*0\s+/i,
            /[\*＊](0|-+)$/i,
            /^0+\s+/i,
            /\s+0$/i,
            /_0_/i,
            /\bqty=0/i,
            /\(\/?\)/i,
            /\[\/?\]/i,
            /【\/?】/i,
            /（\/?）/i,
            /\[\*\]/i,
            /This post has been edited by/i,
            /infinite/i,
            /∞/i,
            /\bnot\s+available\b/i,
            /\bunavailable\b/i,
            /\bN\/A\b/i,
            /\bout of stock\b/i,
            /\b(none|restocking)\b/i,
        ]
        for(var i=0, len=stockout_patterns.length; i<len; i++) {
            if(stockout_patterns[i].test(line)) {
                //console.log(stockout_patterns[i], line)
                return true
            }
        }
        return false
    }

    var remove_quotes = function(s) {
        var p = [
            /<div [^>]*class=.quotetop.>.*?<\/div>/gi,
            /<div [^>]*class=.quotemain.>.*?<\/div>/gi,
        ]
        while(p[0].test(s) || p[1].test(s)) {
            s = s.replace(p[0], '')
            s = s.replace(p[1], '')
        }
        return s
    }

    var get_text = function(e) {
        var s = e.innerHTML
        s = s.replace(/<!--.*?-->/gi, '')
        if(remove_quoted_text){ s = remove_quotes(s) }
        if(remove_strike_through_line) { s = s.replace(/<strike>.*?<\/strike>/g, '') }
        s = s.replace(/<br\s*[^>]*>/g, '\n').replace(/<\/li>/g, '\n').replace(/<ul>/g, '\n').replace(/<\/?blockquote>/g, '\n')
        s = s.replace(/<[^>]+>/g, '').replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '')
        s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        s = s.replace(/[ \t]+/g, ' ')
        s = s.replace(/\u200c/g, '')
        //console.log('='.repeat(150)); console.log(s)
        return s
    }
    var out = ''

    if(result_box_position == 'left') {
        var first_post = $('.post2')
        var posts = $$('.borderwrap')
        for(var i=0, len=posts.length; i<len; i++) {
            var poster = $(posts[i], '.bigusername')
            if((!poster) || (poster.textContent != $('.bigusername').textContent)) { continue } // skip threads that are not posted by the shop owner

            var lines = get_text($(posts[i], '.postcolor')).split('\n')
            var out = ''
            for(var j=0, len2=lines.length; j<len2; j++) {
                var line = lines[j]
                if(stockout(line)) { continue }
                for(var k=0, len3=grep_patterns.length; k<len3; k++) {
                    for(var m=0, len4=grep_patterns[k][0].length; m<len4; m++) {
                        var grepped = false
                        if(grep_patterns[k][0][m].test(line)) {
                            grepped = true
                            out = out + line.substring(0, max_length) + '\n'
                            break
                        }
                    }
                    if(grepped) { break }
                }
            }
            if(out) {
                if(display_title_and_poster && (/#1/.test($(posts[i], '.postdetails').textContent))) {
                    var shop_title = $$('.maintitle>table>tbody>tr>td>div')[0].textContent
                    out = '[Title]\t' + shop_title.substring(0, max_length) + '\n' + '[Poster] ' + poster.textContent.substring(0, max_length)+ '\n\n' + out
                }
                var d = doc.createElement('DIV')
                d.className = 'result'
                d.style.cssText = 'background:rgba(237,235,223,1); color:#5C0D11'
                //d.appendChild($(posts[i], '.postdetails').cloneNode(true))
                var anchor = doc.createElement('A')
                anchor.text = $(posts[i], '.postdetails').textContent
                anchor.href = href.replace(loc.hash, '') + '#' + $(posts[i], '*[id^="post-main-"]').id
                d.appendChild(anchor)
                var pre = doc.createElement('PRE')
                pre.appendChild(doc.createTextNode(out))
                d.appendChild(pre)
                first_post.parentNode.insertBefore(d, first_post)
            }
        }

        var toggle_results = function() {
            var divs = $$(first_post.parentNode, '.result')
            for(var i=divs.length-1; i>=0; i--) {
                if(divs[i].style.display != 'none') { divs[i].style.display = 'none' } else { divs[i].style.display = '' }
            }
        }
        addEventListener('keydown', function(evt) { if((evt.target.tagName!='INPUT') && (evt.target.tagName!='TEXTAREA') && (evt.keyCode == hotkey)) { toggle_results() } }, false)
        if(!default_on) { toggle_results() }
    }
    else {
        var result_box = doc.createElement('DIV')
        result_box.id = 'result_box'
        var position = 'inherent'
        if(result_box_position == 'right') { position = 'fixed' }
        result_box.style.cssText = 'top:' + wnd.innerHeight/6 + 'px; right:0px; position:' + position + '; z-index:2147483647;'
        var posts = $$('.borderwrap')
        for(var i=0, len=posts.length; i<len; i++) {
            var poster = $(posts[i], '.bigusername')
            if((!poster) || (poster.textContent != $('.bigusername').textContent)) { continue } // skip threads that are not posted by the shop owner

            var lines = get_text($(posts[i], '.postcolor')).split('\n')
            var out = ''
            for(var j=0, len2=lines.length; j<len2; j++) {
                var line = lines[j]
                if(stockout(line)) { continue }
                for(var k=0, len3=grep_patterns.length; k<len3; k++) {
                    var grepped = false
                    for(var m=0, len4=grep_patterns[k][0].length; m<len4; m++) {
                        if(grep_patterns[k][0][m].test(line)) {
                            grepped = true
                            out = out + line.substring(0, max_length) + '\n'
                            break
                        }
                    }
                    if(grepped) { break }
                }
            }
            if(out) {
                if(display_title_and_poster && (/#1/.test($(posts[i], '.postdetails').textContent))) {
                    var shop_title = $$('.maintitle>table>tbody>tr>td>div')[0].textContent
                    out = '[Title]\t' + shop_title.substring(0, max_length) + '\n' + '[Poster] ' + poster.textContent.substring(0, max_length)+ '\n\n' + out
                }
                var d = doc.createElement('DIV')
                d.className = 'result'
                d.style.cssText = 'background:rgba(237,235,223,1); color:#5C0D11'
                //d.appendChild($(posts[i], '.postdetails').cloneNode(true))
                var anchor = doc.createElement('A')
                anchor.text = $(posts[i], '.postdetails').textContent
                anchor.href = href.replace(loc.hash, '') + '#' + $(posts[i], '*[id^="post-main-"]').id
                d.appendChild(anchor)
                var pre = doc.createElement('PRE')
                pre.appendChild(doc.createTextNode(out))
                d.appendChild(pre)
                result_box.appendChild(d)
            }
        }
        $('.postcolor').parentNode.insertBefore(result_box, $('.postcolor'))

        var toggle_result_box = function() {
            var result_box = $('#result_box')
            if(result_box.style.display != 'none') { result_box.style.display = 'none' } else { result_box.style.display = '' }
        }
        addEventListener('keydown', function(evt) { if((evt.target.tagName!='INPUT') && (evt.target.tagName!='TEXTAREA') && (evt.keyCode == hotkey)) { toggle_result_box() } }, false)
        if(!default_on) { toggle_result_box() }
    }

    // Highlights equipments and items
    var posts = $$('.postcolor')
    for(var i=posts.length-1; i>=0; i--) {
        var lnks = $$(posts[i], 'A')
        for(var j=lnks.length-1; j>=0; j--) {
            for (var k=0, len=grep_patterns.length; k<len; k++) {
                var highlighted = false
                for(var m=grep_patterns[k][0].length-1; m>=0; m--) {
                    if(grep_patterns[k][0][m].test(lnks[j].text)) {
                        highlighted = true
                        var spans = lnks[j].querySelectorAll('span')
                        if(spans.length) {
                            for(var n=spans.length-1; n>=0; n--) {
                                (function(){
                                    var text = spans[n].textContent
                                    var node = doc.createTextNode(text)
                                    spans[n].parentNode.replaceChild(node, spans[n])
                                }
                                )()
                            }
                        }
                        lnks[j].style.color = 'white'
                        lnks[j].style.backgroundColor = grep_patterns[k][1]
                        if(grep_patterns[k][2] != '') { lnks[j].style.cssText = grep_patterns[k][2] }
                        break
                    }
                } if(highlighted) { break }
            }
        }
    }
}
