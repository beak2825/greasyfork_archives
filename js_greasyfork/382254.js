// ==UserScript==
// @name         从phpMyAdmin复制数据表字段
// @namespace    https://leochan.me
// @version      3.0.1
// @description  懒人从phpMyAdmin复制数据表字段，就这么简单！
// @author       Leo
// @license      GPLv2
// @match        *://*/tbl_structure.php*
// @match        *://*/sql.php?db=*
// @match        *://*/tbl_sql.php?db=*
// @match        *://*/index.php?route=/table/structure&db=*&table=*
// @match        *://*/*/tbl_structure.php*
// @match        *://*/*/sql.php?db=*
// @match        *://*/*/tbl_sql.php?db=*
// @match        *://*/*/index.php?route=/table/structure&db=*&table=*
// @require      https://greasyfork.org/scripts/474124-%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E5%B0%86%E6%96%87%E6%9C%AC%E4%BF%9D%E5%AD%98%E6%88%90%E6%96%87%E4%BB%B6%E5%B9%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD/code/%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E5%B0%86%E6%96%87%E6%9C%AC%E4%BF%9D%E5%AD%98%E6%88%90%E6%96%87%E4%BB%B6%E5%B9%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.js?version=1242483
// @require      https://greasyfork.org/scripts/474123-%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E4%BE%A6%E5%90%AC%E7%BD%91%E5%9D%80%E5%8F%98%E5%8C%96/code/%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E4%BE%A6%E5%90%AC%E7%BD%91%E5%9D%80%E5%8F%98%E5%8C%96.js?version=1242468
// @require      https://greasyfork.org/scripts/470018-%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E6%8F%90%E9%86%92%E8%83%BD%E5%8A%9B/code/%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E6%8F%90%E9%86%92%E8%83%BD%E5%8A%9B.js?version=1214590
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/382254/%E4%BB%8EphpMyAdmin%E5%A4%8D%E5%88%B6%E6%95%B0%E6%8D%AE%E8%A1%A8%E5%AD%97%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/382254/%E4%BB%8EphpMyAdmin%E5%A4%8D%E5%88%B6%E6%95%B0%E6%8D%AE%E8%A1%A8%E5%AD%97%E6%AE%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function replaceText( text ){
        return text.replace( /(\(([\d]+)\))|(\(([\d]+)\,([\d]+)\))/g, '' ).replace( /^[\s　]+|[\s　]+$/g, '' ).replace( /[\r\n\t]/g, '' ).replace( /^\s*|\s*$/g, '' );
    }
    function getKeyType( text ){
        text = replaceText( text ).toLowerCase();
        switch( text ){
            case 'int':
            case 'tinyint':
            case 'smallint':
            case 'mediumint':
            case 'bigint':
                return 'int';
            case 'text':
            case 'varchar':
            case 'mediumtext':
            case 'longtext':
            case 'char':
                return 'string';
            case 'decimal':
            case 'float':
            case 'double':
                return 'float';
        }
    }
    function generateGet( k, t ){
      var keys = k.split('_');
      return '\t/**\n\t *\n\t * @return ' + t + '\n\t *\n\t */\n\tpublic function get' + keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + keys[1].charAt(0).toUpperCase() + keys[1].slice(1) + "(){\n\t\treturn $this->" + k + ";\n\t}";
    }
    function generateSet( k ){
      var keys = k.split('_');
      return '\t/**\n\t *\n\t * @param $' + k + '\n\t * @return $this\n\t *\n\t */\n\tpublic function set' + keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + keys[1].charAt(0).toUpperCase() + keys[1].slice(1) + "( $" + k + " ){\n\t\t$this->" + k + " = $" + k + ";\n\t\treturn $this;\n\t}";
    }
    function generatea( ks ){
        var len = ks.length, f = [];
        for( var i = 0;i < len; i++ ){
            f.push( "'" + ks[i] + "' => '" + ks[i].split('_')[1] + "'" );
        }
        return "\n\t/**\n\t *\n\t * @return array\n\t *\n\t */\n\tprotected function setKeyMapping() : array{\n\t\treturn [ " + f.join( ', ' ) + " ];\n\t}";
    }
    function generateb( ks ){
        var len = ks.length, f = [];
        for( var i = 0;i < len; i++ ){
            f.push( "'" + ks[i].split('_')[1] + "' => '" + ks[i] + "'" );
        }
        return "\n\t/**\n\t *\n\t * @return array\n\t *\n\t */\n\tprotected function setKeyMappingData() : array{\n\t\treturn [ " + f.join( ', ' ) + " ];\n\t}";
    }
    function getKeyDesc( text ){
        text = text.replace( /(^\s*)|(\s*$)/g, '' ).replace( /[\r\n\t]/g, '' );
        if( text.length > 40 ){
            text = text.substring( 0, 41 ) + '...';
        }
        return text;
    }
    function getItems(){
        var objs = document.querySelectorAll( '#tablestructure tr' ), max = objs.length, ks = [], ts = [], ds = [];
        if( max <= 0 ){
            return [];
        }
        for( var i = 1; i < max; i++ ){
            ks.push( replaceText( objs[i].childNodes[5].textContent ) );
            ts.push( getKeyType( objs[i].childNodes[7].textContent ) );
            ds.push( getKeyDesc( objs[i].childNodes[17].textContent ) );
        }
        return [ ks, ts, ds ];
    }
    function getCurentTime(){
        var now = new Date(), year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate(), hh = now.getHours(), mm = now.getMinutes(), clock = year + "-";
        if( month < 10 ) clock += "0";
        clock += month + "-";
        if( day < 10 ) clock += "0";
        clock += day + " ";
        if( hh < 10 ) clock += "0";
        clock += hh + ":";
        if( mm < 10 ) clock += '0';
        clock += mm + ":";
        return clock;
    }
    function copyColumns(){
        var tables = getItems(), kset, tset, dset, max, fs = [], gs = [], ss = [], tn = getCurentTime();
        if( tables.length > 0 ){
            kset = tables[0];
            tset = tables[1];
            dset = tables[2];
            max = kset.length
            for( var i = 0; i < max; i++ ){
                fs.push( "\t/**\n\t *\n\t * @var " + tset[i] + " " + dset[i] + "\n\t *\n\t */\n\tprotected $" + kset[i] + ';' );
                gs.push( generateGet( kset[i], tset[i] ) );
                ss.push( generateSet( kset[i] ) );
            }
            setTimeout( function(){
                console.clear();
                var fname = kset[0].split('_')[0], tname = fname.charAt(0).toUpperCase() + fname.slice(1), all = "<?php\n\n/**\n *\n * " + tname + ".php\n *\n * " + tname + " Bean\n *\n * If the code works, then they are written by Leo Chan, and if not, I do not know who wrote it.\n *\n * @author Leo <me@leochan.me>\n * @link https://leochan.me\n * @package php\n * @category\n * @version 1.0\n * @since " + tn + "\n * @update " + tn + "\n * @see\n * @copyright Copyright (c) " + (new Date()).getFullYear() + " Leo (https://leochan.me)\n *\n */\n\ndeclare(strict_types=1);\nnamespace App\\Bean;\nclass " + tname + " extends Base{\n\n";
                all += fs.join( "\n\n" );
                all += "\n\n";
                all += gs.join( "\n\n" );
                all += "\n\n";
                all += ss.join( "\n\n" );
                all += "\n";
                all += generatea(kset);
                all += "\n";
                all += generateb(kset);
                all += "\n}";
                webPageDownloadTextFile(all, tname + '.php')
            }, 500 );
        }
    }
    webPageWatchUrl(copyColumns);
})();