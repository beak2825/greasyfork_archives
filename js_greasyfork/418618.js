// ==UserScript==
// @name         pincong colorify
// @namespace    http://tampermonkey.net/
// @version      2.1.6 "Dead Deer"
// @description 品葱页面彩色化油猴脚本
// @author       "rebecca" on Pincong.rocks (original author) - upload to this site by others
// @include      *pincong.rocks
// @include      *pincong.rocks*
// @include      *mohu.rocks
// @include      *mohu.rocks*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/418618/pincong%20colorify.user.js
// @updateURL https://update.greasyfork.org/scripts/418618/pincong%20colorify.meta.js
// ==/UserScript==

// pincong colorify plugin
// by rebecca 2020/03/05

(()=>{
    var gebcn = e=> cn=>e.getElementsByClassName(cn)
    var print = console.log
    var foreach = a=> f=>{var r=[];for(var i=0;i<a.length;i++){r.push(f(a[i]))}return r}

    var cap = i=>Math.min(Math.max(i,0), 1)
    var rgbify = a=>`rgb(${a.join(',')})`

    function colormap(i){ // i within -1..1
        var red = [255,200,162,.65] // reddish
        var green = [235, 255, 229, 0.65] // greenish
        var c = i>=0?green:red
        i = (i>=0?i:-i)
        c[3] *= cap(i)
        return rgbify(c)
    }

    function colormap2(i){ // different shades of yellow
        var yellow = [255,255,100, 0.5]
        yellow[3]*=i
        return rgbify(yellow)
    }


    function vote2col(v){
        if(v>0){
            v = Math.log10(v+1)
        }else if (v<0) {
            v = -Math.log10(-v+1)
        }else{
            v = 0
        }
        v *= 0.6
        v = Math.max(v,-1)
        v = Math.min(v, 1)
        return colormap(v)
    }

    function mark_everything(){

        var colorize = ans=>{

            // calculate color based on votecount
            var votecount = gebcn(ans)('count')
            if(votecount.length){
                votecount = parseInt(votecount[0].innerHTML)
                // print('vote',votecount)
                ans.style.backgroundColor = vote2col(votecount)
                return
            }

            // otherwise calculate color based on reactiveness
            var replies = gebcn(ans)('aw-small-text')

            if(replies.length){
                // things in aw-small-text might not be what we want
                // so we have to filter thru each of them
                for(var j=0;j<replies.length;j++){
                    var line = replies[j].innerHTML
                    var res = line.match('.*?(\\d+).*?(\\d+).*?')
                    if(res){
                        if(res.length!=3){
                            continue
                        }else{
                            var nreplies = parseInt(res[1])
                            var views = parseInt(res[2])
                            var hotness=0
                            if(views==0){
                                hotness = 0
                            }else{
                                hotness = nreplies/views
                                hotness = cap(hotness*20)
                                ans.style.backgroundColor = colormap2(hotness)
                            }
                            return
                        }
                    }
                }
            }
        }

        var div_awitem = gebcn(document)('aw-item')
        // print(`[Brexit] Got ${div_awitem.length} item(s).`)

        foreach(div_awitem)(colorize)
        foreach(gebcn(document)('aw-mod aw-question-detail'))(colorize)

        // user profile page show UID
        var namediv = gebcn(document)('mod-head')
        if(namediv.length>0){
            namediv = namediv[0]
            var uid = null
            var scripts = document.scripts
            //print(scripts)
            foreach(scripts)(s=>{
                uid = uid || s.innerHTML.match(/questions\/uid-(\d{0,9})'/)
            })
            if(uid!==null){
                if(uid.length==2){
                    uid = uid[1]
                    namediv.innerHTML = `(uid:${uid}) ` + namediv.innerHTML
                }
            }
        }

        // username add UID and reputation
        var reputify = d=>{
            //print(d)
            if(d.innerHTML.includes('img src')){
                return
            }
            var da = d.attributes
            if(da){
                var dai = da['data-id']
                var dar = da['data-reputation']
                if(dai && dar){
                    var uid = dai.value
                    var rep = dar.value
                    d.innerHTML += ` (UID:${uid} 声望:${rep})`
                }
            }
        }
        foreach(gebcn(document)('aw-user-name'))(reputify)
        foreach(gebcn(document)('aw-user-name author'))(reputify)
    }

    mark_everything()

    // press F8 to send selected text to google with site:pincong.rocks
    // press F9 to ... without site:pincong.rocks
    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }
    function open_in_new_tab(t, insite){
        if (t.length){
            GM_openInTab(`https://www.google.com/search?q=${insite?'site%3Apincong.rocks+':''}"${t}"`,{active:true})
        }
    }
    //119 for F8
    //120 for F9
    document.addEventListener("keyup", event => {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }
        var ek = event.keyCode
        if (ek==119){
            open_in_new_tab(getSelectionText(), true)
        }else if (ek==120){
            open_in_new_tab(getSelectionText(), false)
        }
    });
})()