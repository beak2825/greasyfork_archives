// ==UserScript==
// @name        NS_PrimeWire
// @namespace   mugPuke
// @include     https?://www.primewire.ag/watch*
// @include     https?://www.primewire.ag/tv-*
// @version     1
// @description Sorts and filters primewire video hosts.
// @grant       none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/33082/NS_PrimeWire.user.js
// @updateURL https://update.greasyfork.org/scripts/33082/NS_PrimeWire.meta.js
// ==/UserScript==

// author: mugPuke, license: GPL v3
(function () {
    
    // vid hosters that should be removed (edit to your liking):
    var block = new Set([
        // advertisement
        // ---------------------------------------------------------------------
        'Sponsor Host',
        'Promo Host',
        
        // hosters that are not covered by the NS_primewire_hosters script
        // ---------------------------------------------------------------------
//        'movdivx.com',   // needs divx
//        'movshare.net',  // 500 err  - 17.09.31
//        'noslocker.com', // NS_* script xml playlist
//        'nosvideo.com',  // NS_* script xml playlist
//        'novamov.com',   // 500 err  - 17.09.31
//        'nowvideo.sx',   // 500 err  - 17.09.31
//        'speedvid.net',  // cookie   - 17.09.31
//        'streamin.to',   // TODO
//        'streamplay.to', // Wrong IP - 17.09.31
//        'thevideo.me',   // NS_* TOS
//        'videoweed.es',  // 500 err  - 17.09.31
//        'vidup.me',      // NS_* TOS
//        'vshare.eu',     // TODO
        
        // not tested hosters:
        // ---------------------------------------------------------------------
//         'briskfile.com',
//         'cloudtime.to',
//         'filenuke.com',
//         'letwatch.us',
//         'movshare.net',
//         'novamov.com',
//         'nowvideo.sx',
//         'playedto.me',
//         'promptfile.com', 
//         'sharerepo.com',
//         'sharesix.com',
//         'thefile.me',
//         'vidbull.com',
//         'videoweed.es',
//         'vidlockers.ag',
//         'vidto.me',
//         'vodlocker.com',
    ]);
    
    // vid hoster sord order (edit to your liking):
    // -------------------------------------------------------------------------
    var sort = new Map();
    var idx = 0;
    sort.set( "vidlox.tv", idx++ );
    sort.set( "vidzi.to", idx++ );
    sort.set( "vidzi.tv", idx++ );
    sort.set( "vidtodo.com", idx++ );
    sort.set( "daclips.com", idx++ );
    sort.set( "daclips.in", idx++ );
    sort.set( "gorillavid.com", idx++ );
    sort.set( "gorillavid.in", idx++ );
    sort.set( "movpod.net", idx++ );
    sort.set( "movpod.in", idx++ );
    
    
    // trim strings
    var trim = function(str) 
    {
        var	str = str.replace(/^\s\s*/, '');
        var ws = /\s/;
        var i = str.length;
        
        while (ws.test(str.charAt(--i)));
        return str.slice(0, i + 1);
    }
    
    // url table elements
    var getTargets = function()
    {
        return document.querySelectorAll('#first table.movie_version');
    }
    
    // url table container
    var getTargetParent = function()
    {
        return document.querySelector('#first');
    }
    
    var sort_fcn = function( a, b )
    {
        if(b == null)
        {
            return false;
        }
        if(a == null)
        {
            return true;
        }
        
        var a_elem = a.querySelector("span.version_host");
        var b_elem = b.querySelector("span.version_host");       
        
        if(b_elem == null)
        {
            return false;
        }
        if(a_elem == null)
        { 
            return true;
        }
        
        var a_str = trim(a_elem.innerHTML);
        var b_str = trim(b_elem.innerHTML);        
        var a_flag = sort.has(a_str);
        var b_flag = sort.has(b_str);
        
        if( a_flag && b_flag )
        {
            var f = sort.get(a_str) > sort.get(b_str);
            return f;
        }
        else if( a_flag )
        {
            return false;
        }
        else if( b_flag )
        {
            return true;
        }
        
        return a_str > b_str;
    }
    
    var cleanTargets = function( targets )
    {
        // write hoster info without enabled js
        var reg = /document.writeln\('(.[^']*)'\)/;
        var out_arr = [];
        
        for(var target of targets)
        {
            var sub_target = target.querySelector("span.version_host");
            if(sub_target == null)
            {
                continue;
            }
            
            var trash_target = sub_target.querySelector("script");
            if(trash_target != null)
            {
                var matches = reg.exec(trash_target.innerHTML)
                if (matches.length < 2) 
                {
                    continue
                }
                sub_target.innerHTML = matches[1];
            }
            var str = trim(sub_target.innerHTML);
            
            if (block.has(str))
            {
                continue;
            }
            sub_target.innerHTML = str;
            out_arr.push(target)
        }
        return out_arr;
    }
    
    var main = function()
    {        
        var targets = getTargets();
        var targetsLen = targets.length;
        
        if (targetsLen == 0)
        {
            console.log("Targets missing.")
            return;
        }
        
        targets_arr = cleanTargets( targets )
        
        targets_arr.sort(sort_fcn);
        
        // clean container ...
        var parent = getTargetParent();
        parent.innerHTML = " ";
        
        // ... and repopulate it
        for(var target of targets_arr)
        {
            if(target == null){continue;}
            
            parent.appendChild(target);
        }
    }
    main();
}());
