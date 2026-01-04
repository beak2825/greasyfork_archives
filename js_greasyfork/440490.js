// ==UserScript==
// @name         TGFC User Tagging
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  给TGFC加上标记用户/屏蔽用户帖子/修改用户帖子颜色/保存用户帖子/暴力搜索
// @author       Hibino
// @include        http*://bbs.tgfcer.com/*
// @include        http*://club.tgfcer.com/*
// @include        http*://s.tgfcer.com/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440490/TGFC%20User%20Tagging.user.js
// @updateURL https://update.greasyfork.org/scripts/440490/TGFC%20User%20Tagging.meta.js
// ==/UserScript==

/* CSSs
.tgut-clear{
    clear: both;
}
.tgut-blur{
    filter: blur(20px);
}
.tgut{
    right: 0;
    position: absolute;
    font-weight: normal;
}
.tgut:hover{
}
.tgut-msg{
    display: none;
    position: fixed;
    width: 300px;
    padding: 5px 10px;
    top: 0;
    left: 50%;
    margin-left: -150px;
    color: #ffffff;
    text-align: center;
    background: #0033cc;
    z-index: 300;
}
.tgut .t{
    display: block;
    padding: 2px 5px;
    color: #ffffff;
    background: #006cc2;
}
.tgut .m{
    display: none;
    position: absolute;
    width: 165px;
    right: 0;
    padding: 10px;
    color: #444444;
    text-align: right;
    border: 3px solid #006cc2;
    background: #ffffff;
    z-index: 100;
}
.tgut:hover .m{
    display: block;
}
.tgut .in{
    width: 110px;
}
.tgut .but{
    color: #ffffff;
    border: 0;
    background: #006cc2;
}
.tgut .tag{
    margin: 0 0 10px;
}
.tgut .colors{
    margin: 0 0 10px;
}
.tgut .clor{
    margin: 0 0 10px;
}
.tgut .remv{
    margin: 0 0 10px;
}
.tgut .colors .c{
    float: right;
    width: 32px;
    height: 32px;
    margin: 0;
}
.tgut .colors .f{
    margin-right: 0;
}
.tgut .colors .c1{
    background: #641e16;
}
.tgut .colors .c2{
    background: #4a235a;
}
.tgut .colors .c3{
    background: #0b5345;
}
.tgut .colors .c4{
    background: #7d6608;
}
.tgut .colors .c5{
    background: #424949 ;
}
.tgut .colors .c6{
    background: #e74c3c;
}
.tgut .colors .c7{
    background: #f7dc6f;
}
.tgut .colors .c8{
    background: #85929e;
}
.tgut .colors .c9{
    background: #17a589 ;
}
.tgut .colors .c10{
    background: #f0b27a;
}
.tgut-tag{
    margin: 10px 0;
    color: #ffffff;
    text-align: center;
    line-height: 24px;
    border: 0;
    background: #006cc2;
}
.tgut-page-cover{
    display: none;
    position:absolute;
    top: 0;
    left: 0;
    -moz-opacity: 0.6;
    opacity: 0.6;
    background-color: #000000;
    z-index: 200;
}
.tgut-popup{
    position: absolute;
    display: none;
    left: 50%;
    top: 10%;
    width: 60%;
    background: #ffffff;
    border: 5px solid #006cc2;
    z-index: 250;
}
.tgut-popup .f-l{
    float: left;
}
.tgut-popup .f-r{
    float: right;
}
.tgut-popup .tt{
    padding: 0 10px;
    line-height: 28px;
    color: #ffffff;
    background: #006cc2;
}
.tgut-popup .cls{
}
.tgut-popup .cls a{
    display: block;
    width: 24px;
    float: right;
    font-size: 120%;
    color: #fff;
    line-height: 24px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
}
.tgut-popup .cls a:hover{
    color: #0e5685;
    background: #fff;
}
.tgut-popup .ct{
    clear: both;
    __padding: 5px;
    text-align: left;
}
.tgut-posts{
    padding: 10px;
}
.tgut-posts .post{
    clear: both;
    margin: 10px 0 20px 0;
    padding: 10px;
    background: #f0f0f0;
    border-bottom: 2px solid #006cc2;
    overflow: hidden;
}
.tgut-posts .pid{
    float: right;
    margin: 0 20px 0 0;
    font-weight: bold;
    text-decoration: underline;
}
.tgut-posts .time{
    float: left;
    font-weight: bold;
}
.tgut-posts .del{
    float: right;
}
.tgut-posts .del button{
    color: #ffffff;
    border: 0;
    background: #006cc2;
}
.tgut-posts .ct{
    clear: both;
    margin: 10px 0;
}
.tgut-but{
    display: inline-block;
    margin: 0 5px 0 0;
    padding: 2px 5px;
    color: #ffffff;
    background: #006cc2;
    cursor: pointer;
}
.tgut-sett{
    padding: 10px;
}
.tgut-sett .but{
    color: #ffffff;
    border: 0;
    background: #006cc2;
}
.tgut-sett .b{
    text-align: right;
}
.tgut-sett .t{
    margin: 20px 0;
}
.tgut-sett .t .txa{
    width: 99%;
    height: 200px;
}
.tgut-sch{
    padding: 10px;
}
.tgut-sch .t{
    text-align: center;
}
.tgut-sch .t .slc{
    width: 160px;
}
.tgut-sch .t .inp{
    width: 340px;
}
.tgut-sch .t .usr{
    width: 100px;
}
.tgut-sch .but{
    display: inline-block;
    margin: 0 5px 0;
    color: #ffffff;
    border: 0;
    background: #006cc2;
}
.tgut-sch .s{
    margin: 5px auto;
    text-align: center;
}
.tgut-sch .s span{
    display: inline-block;
    margin: 0 5px;
    font-weight: bold;
}
.tgut-sch .rs{
    margin: 10px 0;
}
.tgut-sch .p{
    margin: 5px 0;
}
.tgut-sch .p .u{
    color: #888888;
}
.tgut-sch .e{
    text-align: center;
}
.tgut-sch .e strong{
    font-weight: bold;
}
*/

(function() {
    'use strict';

    var DATA_FILE = "tgfc_user_tags";
    var POST_URL = "/redirect.php?goto=findpost&pid=";
    var HTML_USERNAME =
        '<div id="tgut_pid_PID" class="tgut" data-uid="UID" data-pid="PID" >' +
        '<div class="t">TGUT</div>' +
        '<div class="m">' +
        '<div class="tag">标签：<input class="in" type="text" name="tag" value="TAG" /></div>' +
        '<div class="colors">' +
        '<div class="c c1 f"></div>' +
        '<div class="c c2"></div>' +
        '<div class="c c3"></div>' +
        '<div class="c c4"></div>' +
        '<div class="c c5"></div>' +
        '<div class="c c6 f"></div>' +
        '<div class="c c7"></div>' +
        '<div class="c c8"></div>' +
        '<div class="c c9"></div>' +
        '<div class="c c10"></div>' +
        '<div class="tgut-clear"></div></div>' +
        '<div class="clor">颜色：<input class="in" type="text" name="color" value="COLOR" /></div>' +
        '<div class="remv"><label><input type="checkbox" name="remove_post" value="1" REMOVE_POST>隐藏该用户帖子</label></div>' +
        '<button class="but but-save-tag" type="button" name="dummy" value="Save" data-pid="PID">保存</button>' +
        '<hr>' +
        '<button class="but but-save-post" type="button" name="dummy" value="Save Post" data-pid="PID" data-uid="UID">保存帖子</button>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<button class="but but-view-posts" type="button" name="dummy" value="Save Post" data-pid="PID" data-uid="UID">查看帖子</button>' +
        '</div>' +
        '</div>';
    var HTML_TAG = '<div class="tgut-tag">TAG</div>';
    var HTML_MSG = '<div id="tgut_msg" class="tgut-msg"></div>';
    var HTML_POPUP =
        '<div class="tgut-page-cover" id="tgut_page_cover"></div>' +
        '<div class="tgut-popup" id="tgut_popup">' +
        '<div class="tt"><div class="f-l" id="tgut_popup_title">&nbsp;</div><div class="f-r cls" id="tgut_popup_close"><a>X</a></div><div class="tgut-clear"></div></div>' +
        '<div class="ct" id="tgut_popup_content"></div>' +
        '</div>';
    var HTML_SETTINGS =
        '<div id="tgut_settings" class="tgut-sett">'+
        '<div class="b"><button class="but but-clean" type="button" name="dummy" value="Clean">清除数据</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<button class="but but-export" type="button" name="dummy" value="Export">导出数据</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<button class="but but-import" type="button" name="dummy" value="Import">导入数据</button></div>'+
        '<div class="t">导出时请保存下框的所有文本数据。导入时请把文本数据复制到下框然后点击“导入数据”按钮' +
        '<br /><textarea id="tgut_data_text" class="txa" name="dummy"></textarea></div>' +
        '</div>';
    var HTML_SEARCH =
        '<div id="tgut_search" class="tgut-sch">' +
        '<div class="t">' +
        '<select id="tgut_search_fid" class="slc" name="dummy"><option value="">无法取得版块列表</option></select>&nbsp;&nbsp;' +
        '<input id="tgut_search_inp" class="inp" type="text" name="dummy" value="" placeholder="多个关键字用半角空格隔开，关键字之间的关系是AND">' +
        '<input id="tgut_search_user" class="usr" type="text" name="dummy" value="" placeholder="用户名 (AND)">' +
        '<button id="tgut_search_but" class="but" name="dummy" value="search">搜索</button>'+
        '<button id="tgut_search_next" class="but" name="dummy" value="next">继续搜索</button>' +
        '<button id="tgut_search_stop" class="but" name="dummy" value="stop">停止搜索</button>' +
        '<button id="tgut_search_reset" class="but" name="dummy" value="reset">重置</button>' +
        '</div><div class="s">当前搜索页<span id="tgut_search_page">1</span></div>' +
        '<div id="tgut_search_results" class="rs"><div class="e">' +
        '选择版块，输入要搜索的内容回车或者点击“搜索”按钮。当找到结果搜索会停下，如果结果不是你想要的请点击“继续搜索”。要重新搜索请先点击“重置”' +
        '<br>添加/删除搜索的版块请自行编辑脚本第356行开始的FORUM_IDS变量' +
        '<br><strong>这是暴力一页一页的搜索，请不要经常使用以防止给服务器带来沉重负担</strong></div></div>'+
        '</div>';
    var FORUM_IDS = {
        '33': '游戏业界综合讨论区',
        '10': '完全数码讨论区',
        '25': '灌水与情感',
        '12': '影视专区',
        '6': '体育运动专区',
        '90': '二手交易区',
        '59': '汽车版',
        '85': 'Apple 专区',
        '41': '摄影区',
        '11': '动漫模玩',
        '29': '主机&掌机游戏讨论区',
        '101': '经典游戏怀旧专区',
        '5': '手机游戏讨论区',
        '97': '旅行度假',
        '86': '招聘求职'
    };


    GM_addStyle(
        '.tgut-clear{clear:both}.tgut-blur{filter:blur(20px)}.tgut{right:0;position:absolute;font-weight:400}.tgut-msg{display:none;position:fixed;width:300px;padding:5px 10px;top:0;left:50%;margin-left:-150px;color:#fff;text-align:center;background:#03c;z-index:300}.tgut .t{display:block;padding:2px 5px;color:#fff;background:#006cc2}.tgut .m{display:none;position:absolute;width:165px;right:0;padding:10px;color:#444;text-align:right;border:3px solid #006cc2;background:#fff;z-index:100}.tgut:hover .m{display:block}.tgut .in{width:110px}.tgut .but{color:#fff;border:0;background:#006cc2}.tgut .tag{margin:0 0 10px}.tgut .colors{margin:0 0 10px}.tgut .clor{margin:0 0 10px}.tgut .remv{margin:0 0 10px}.tgut .colors .c{float:right;width:32px;height:32px;margin:0}.tgut .colors .f{margin-right:0}.tgut .colors .c1{background:#641e16}.tgut .colors .c2{background:#4a235a}.tgut .colors .c3{background:#0b5345}.tgut .colors .c4{background:#7d6608}.tgut .colors .c5{background:#424949}.tgut .colors .c6{background:#e74c3c}.tgut .colors .c7{background:#f7dc6f}.tgut .colors .c8{background:#85929e}.tgut .colors .c9{background:#17a589}.tgut .colors .c10{background:#f0b27a}.tgut-tag{margin:10px 0;color:#fff;text-align:center;line-height:24px;border:0;background:#006cc2}.tgut-page-cover{display:none;position:absolute;top:0;left:0;-moz-opacity:.6;opacity:.6;background-color:#000;z-index:200}.tgut-popup{position:absolute;display:none;left:50%;top:10%;width:60%;background:#fff;border:5px solid #006cc2;z-index:250}.tgut-popup .f-l{float:left}.tgut-popup .f-r{float:right}.tgut-popup .tt{padding:0 10px;line-height:28px;color:#fff;background:#006cc2}.tgut-popup .cls a{display:block;width:24px;float:right;font-size:120%;color:#fff;line-height:24px;cursor:pointer;text-align:center;text-decoration:none}.tgut-popup .cls a:hover{color:#0e5685;background:#fff}.tgut-popup .ct{clear:both;text-align:left}.tgut-posts{padding:10px}.tgut-posts .post{clear:both;margin:10px 0 20px 0;padding:10px;background:#f0f0f0;border-bottom:2px solid #006cc2;overflow:hidden}.tgut-posts .pid{float:right;margin:0 20px 0 0;font-weight:700;text-decoration:underline}.tgut-posts .time{float:left;font-weight:700}.tgut-posts .del{float:right}.tgut-posts .del button{color:#fff;border:0;background:#006cc2}.tgut-posts .ct{clear:both;margin:10px 0}.tgut-but{display:inline-block;margin:0 5px 0 0;padding:2px 5px;color:#fff;background:#006cc2;cursor:pointer}.tgut-sett{padding:10px}.tgut-sett .but{color:#fff;border:0;background:#006cc2}.tgut-sett .b{text-align:right}.tgut-sett .t{margin:20px 0}.tgut-sett .t .txa{width:99%;height:200px}.tgut-sch{padding:10px}.tgut-sch .t{text-align:center}.tgut-sch .t .slc{width:160px}.tgut-sch .t .inp{width:340px}.tgut-sch .t .usr{width:100px}.tgut-sch .but{display:inline-block;margin:0 5px 0;color:#fff;border:0;background:#006cc2}.tgut-sch .s{margin:5px auto;text-align:center}.tgut-sch .s span{display:inline-block;margin:0 5px;font-weight:700}.tgut-sch .rs{margin:10px 0}.tgut-sch .p{margin:5px 0}.tgut-sch .p .u{color:#888}.tgut-sch .e{text-align:center}.tgut-sch .e strong{font-weight:700}'
    );

    $( 'body' ).append( HTML_MSG );
    $( 'body' ).append( HTML_POPUP );


    function test( v ){
        return ( v && v !== 0 && v != "0" );
    }
    function trim( txt ){
        return ( txt ? txt.replace( /^\s+|\s+$/g, "" ) : "" );
    }
    function html( s ){
        if( typeof s == 'string' ){
            return s.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        return '';
    }
    function count_obj( o, true_only ){
        var c = 0;
        for( var i in o ){
            true_only ? ( test( o[i] ) && c++ ) : c++;
        }
        return c;
    }
    function tl( o ){
        console.log( o );
    }


    var tg = {

        is_logged_in: 0,
        data_init: {
            version: 2,
            users: {},
            posts: {},
        },
        user_init: {
            uid: 0,
            name: '',
            tag: '',
            color: '',
            remove_post: 0,
            parent_uid: 0,
            related_uids: {},
            quotes: {}
        },
        data: {},

        msg: function( m ){
            $( '#tgut_msg' ).html( m ).stop( true, true ).show( 1, function(){ $( '#tgut_msg' ).animate( {"null":1}, 1000 ).fadeOut( 200 ); } );
        },

        load_data: function(){
            var data = tg.data_init;
            var tmp = GM_getValue( DATA_FILE, "" );

            try{
                data = JSON.parse( tmp );
            }catch( e ){

            }
            if( test( data.version ) ){
                tg.data = data;
            }
        },
        save_data: function(){
            GM_setValue( DATA_FILE, JSON.stringify( tg.data ) );
        },
        clean_data: function(){
            tg.data = tg.data_init;
            tg.save_data();
        },
        update_data: function(){
            if( tg.data.version < 2 ){
                tg.data.posts = {};
                tg.data.version = 2;
                tg.save_data();
            }
        },

        init: function(){
            // check if logged in
            var l = $( '#logo' ).next().next();
            if( l.html().indexOf( "logging.php?action=logout" ) > 0 ){
                tg.is_logged_in = 1;
                // read in stored settings
                tg.load_data();
                tg.update_data();

                post.init();
                sett.init();
                sch.init();
            }else{
                // do nothing...
            }

            pop.init();
        }

    };

    var pop = {

        cover: function( on ){
            var c = $( '#tgut_page_cover' );
            var o = $( 'body' );
            if( on ){
                c.css( "width", o.width() ).css( "height", o.height() ).show();
                o.find( '.wrap:first' ).addClass( "tgut-blur" );
            }else{
                o.find( '.wrap:first' ).removeClass( "tgut-blur" );
                c.hide();
            }

        },

        show: function( t, c ){
            var o = $( '#tgut_popup' );
            var top = $(document).scrollTop() + ( o.height() > 500 ? 1 : 100 );
            $( '#tgut_popup_content' ).html( c );
            $( '#tgut_popup_title' ).html( ( t ) );
            o.css( "margin-left", - o.width() / 2 ).css( "top", top ).show();
            pop.cover( 1 );
        },
        close: function(){
            $( '#tgut_popup' ).hide();
            pop.cover();
        },

        init: function(){
            $( '#tgut_popup_close' ).click( pop.close );
        }
    };


    var post = {

        process_posts: function(){
            $( "div.viewthread" ).each(
                function(){
                    var o = $( this );
                    var user = o.find( "cite:first" ).css( "position", "relative" ).css( 'overflow', 'visible' );
                    var popup = o.find( ".userinfopanel" );
                    o.find( '.postauthor' ).css( 'overflow', 'visible' );
                    o.find( '.tgut' ).remove();

                    var name = user.find( "a" ).html();
                    var uid = post.get_uid( popup );
                    var pid = o.find( "table" ).first().prop( "id" ).replace( "pid", "" );

                    //alert( username + ":::" + uid + ":::" + pid );
                    var tag = test( tg.data.users[uid] ) ? tg.data.users[uid] : tg.user_init;
                    var h = HTML_USERNAME;
                    h = h.replace( /PID/g, pid )
                        .replace( /UID/g, uid )
                        .replace( /TAG/g, html( tag.tag ) )
                        .replace( /COLOR/g, html( tag.color ) )
                        .replace( /REMOVE_POST/g, ( test( tag.remove_post ) ? 'checked' : '' ) );
                    var j = new $( h );
                    j.find( ".but-save-tag" ).click( post.save );
                    j.find( ".but-save-post" ).click( post.save_post );
                    j.find( ".but-view-posts" ).click( post.view_posts );
                    j.find( ".c" ).click( post.color_click );
                    user.append( j );

                    if( tag.uid == uid ){
                        user.parent().find( '.tgut-tag' ).remove();
                        if( test( tag.tag ) ){
                            user.after( HTML_TAG.replace( /TAG/g, html( tag.tag ) ) );
                        }
                        user.closest( 'table' ).find( 'td' ).css( 'color', '' );
                        if( test( tag.color ) ){
                            user.closest( 'table' ).find( 'td' ).css( 'color', tag.color );
                        }
                        if( test( tag.remove_post ) ){
                            user.nextAll(":gt(0)").css( 'display', 'none' );
                            o.find( '.postmessage' ).css( 'display', 'none' ).after( '<div class="tgut-mesg">用户帖子和签名被屏蔽</div>' );
                            o.find( '.signatures' ).css( 'display', 'none' );
                        }else{
                            user.nextAll().css( 'display', 'block' );
                            o.find( '.postmessage' ).css( 'display', 'block' );
                            o.find( '.signatures' ).css( 'display', 'none' );
                            o.find( '.tgut-mesg' ).remove();
                        }
                    }
                }
            );
        },
        get_uid: function( d ){
            var s = d.find( "dd:eq(0)" ).html().replace( "&nbsp;", "" );
            return trim( s );
        },
        get_name: function( pid ){
            var name = $( '#pid' + pid ).find( 'cite:first' ).find( "a" ).html();
            return trim( name );
        },
        color_click: function( e ){
            var o = $( this );
            o.closest( ".tgut" ).find( "[name='color']" ).val( o.css( "background-color" ) );

        },
        save: function( e ){
            var o = $( this ).closest( ".tgut" );
            var uid = o.data( "uid" );
            var pid = o.data( "pid" );
            var tag = o.find( "[name='tag']" ).val();
            var color = o.find( "[name='color']" ).val();
            var remove_post = o.find( "[name='remove_post']" ).is( ':checked' );
            if( !test( uid ) ){
                return;
            }
            if( !test( tg.data.users[uid] ) ){
                tg.data.users[uid] = tg.user_init;
            }
            tg.data.users[uid].uid = uid;
            tg.data.users[uid].tag = tag;
            tg.data.users[uid].name = post.get_name( pid );
            tg.data.users[uid].color = color;
            tg.data.users[uid].remove_post = remove_post ? 1 : 0;
            tg.save_data();
            tg.msg( "已保存用户标签" );
            post.process_posts();
        },
        save_post: function( e ){
            var o = $( this );
            var pid = o.data( 'pid' );
            var uid = o.data( 'uid' );
            var content = trim( $( '#postmessage_' + pid ).html() );
            var time_str = trim( $( '#pid' + pid ).find( '.postinfo' ).clone().children().remove().end().text() ); // well well well....

            if( !test( tg.data.posts[uid] ) ){
                tg.data.posts[uid] = {};
            }
            tg.data.posts[uid][pid] = {
                'uid': uid,
                'pid': pid,
                'name': post.get_name( pid ),
                'time': time_str,
                'post': content
            };

            tg.save_data();
            tg.msg( "帖子保存了" );

        },
        del_post: function( e ){
            var o = $( this );
            var pid = o.data( 'pid' );
            var uid = o.data( 'uid' );

            if( test( tg.data.posts[uid] )  && test( tg.data.posts[uid][pid] ) ){
                delete( tg.data.posts[uid][pid] );
                tg.save_data();
                tg.msg( "帖子删除了" );
            }

            $( '#tgut_post_' + pid ).remove();
            if( !count_obj( tg.data.posts[uid] ) ){
                pop.close();
            }

        },
        view_posts: function( e ){
            var o = $( this );
            var pid = o.data( 'pid' );
            var uid = o.data( 'uid' );

            if( !test( tg.data.posts[uid] ) || !count_obj( tg.data.posts[uid] ) ){
                tg.msg( '没有针对该用户保存的帖子' );
                return;
            }

            var name = '';
            var h = '<div class="tgut-posts">';
            for( var i in tg.data.posts[uid] ){
                var p = tg.data.posts[uid][i];
                name = p.name;
                h += '<div class="post" id="tgut_post_' +p.pid+ '"><div class="time">' +p.time+ '</div>' +
                    '<div class="del"><button class="but" name="dummy" value="Del" data-pid="' +p.pid+ '" data-uid="' +p.uid+ '">删除</button></div>' +
                    '<div class="pid"><a href="' +POST_URL+p.pid+ '" target="_blank">Post ID: ' +p.pid+ '</a></div>' +
                    '<div class="ct">' +p.post+ '</div></div>';
            }
            h += '</div>';
            var j = new $( h );
            j.find( '.but' ).click( post.del_post );
            pop.show( name, j );
        },

        init: function(){
            post.process_posts();
        }

    };


    var sett = {

        clean: function(){
            if( confirm( "确定删除所有以保存的用户标签以及帖子吗？" ) ){
                tg.clean_data();
                tg.save_data();
                tg.init();
                tg.msg( "数据已清除" );
            }
        },
        export: function(){
            var str = JSON.stringify( tg.data );
            $( '#tgut_data_text' ).val( str );
            tg.msg( "数据已显示在输入框中" );
        },
        import: function(){
            var data = {};
            var str = trim( $( '#tgut_data_text' ).val() );
            try{
                data = JSON.parse( str );
            }catch( e ){
                tg.msg( "数据不是有效的JSON字串" );
                return;
            }
            if( test( data.version ) ){
                tg.data = data;
                tg.update_data();
                tg.save_data();
                tg.msg( "成功导入数据" );
                tg.init();
            }else{
                tg.msg( "无法识别数据版本" );
            }
        },
        show: function(){
            var j = new $( HTML_SETTINGS );
            j.find( '.but-clean' ).click( sett.clean );
            j.find( '.but-export' ).click( sett.export );
            j.find( '.but-import' ).click( sett.import );
            pop.show( 'TGUT设置', j );
        },

        init: function(){
            // find the user bar beside the log
            var o = $( '#logo' ).parent().find( 'cite:first' ).parent();
            if( !o.find( '.tgut-but' ).length ){
                var j = new $( '<div class="tgut-but">TGUT</div>' );
                j.click( sett.show );
                o.append( j );
            }
        }
    };


    var sch = {
        p: 1,
        s: 0,
        url: "/forum-FID-PAGE.html",
        empty: '',

        show: function(){
            sch.reset();
            pop.show( 'TGUT暴力搜索', HTML_SEARCH );
            $( '#tgut_search_inp' ).keyup( sch.keyup );
            $( '#tgut_search_user' ).keyup( sch.keyup );
            $( '#tgut_search_but' ).click( sch.sch );
            $( '#tgut_search_next' ).click( sch.next );
            $( '#tgut_search_reset' ).click( sch.reset );
            $( '#tgut_search_stop' ).click( sch.stop );

            /* 论坛去掉了左下角的快速链接。。。。
            var o = $( '#footfilter' ).children( 'select' );
            if( o.length == 1 ){
                $( '#tgut_search_fid' ).html( o.html().replace( '版块跳转 ...', '[选择搜索版块]' ) );
            }
            */
            var o = $( '#tgut_search_fid' ).empty().append( '<option value="">[选择搜索版块]</option>' );
            for( var i in FORUM_IDS ){
                o.append( '<option value="' +i+ '">' +FORUM_IDS[i]+ '</option>' );
            }
        },
        reset: function(){
            sch.set_p(1);
            sch.s = 0;
            $( '#tgut_search_inp' ).val( '' );
            $( '#tgut_search_user' ).val( '' );
            $( '#tgut_search_fid' ).val( '' );
        },
        stop: function(){
            sch.s = 1;
        },
        set_p: function( p ){
            sch.p = p;
            $( '#tgut_search_page' ).html( p );
        },
        max_p: function(){
            return 50;
        },
        get_v: function(){
            var v = $( '#tgut_search_inp' ).val().trim();
            if( v ){
                return v.split( ' ' );
            }
            return [];
        },
        get_u: function(){
            var v = $( '#tgut_search_user' ).val().trim();
            return v;
        },
        keyup: function( e ){
            if( e ){
                var k = (e.keyCode) ? e.keyCode : e.which;
                ( k == 13 ) && sch.sch();
            }
            return false;
        },
        next: function(){
            sch.p++
            sch.set_p( sch.p );
            sch.sch();
        },
        fid: function(){
            return $( '#tgut_search_fid' ).val();
        },
        sch: function(){
            var s_v = sch.get_v();
            var s_u = sch.get_u();
            var fid = sch.fid();
            if( ( s_v.length > 0 || s_u ) && fid ){
                if( sch.p < sch.max_p() ){
                    tg.msg( '搜索中....' );
                    var url = sch.url.replace( 'FID', fid ).replace( 'PAGE', sch.p );
                    //$.post( url, {}, sch.sch_callback ); // fxxk the TGFC server does not put charset in header
                    $.ajax({
                        data: {},
                        type: "GET",
                        url: url,
                        beforeSend: function( xhr ) {
                            xhr.overrideMimeType( "text/html; charset=GBK" );
                        },
                        success: sch.sch_callback
                    });
                }else{
                    sch.msg( '已达到最大搜索页数，搜索停止' );
                }
            }else{
                sch.msg( '版块不能为空，关键字和用户名不能同时为空' );
            }
        },
        sch_callback: function( data ){
            var o = $( '#tgut_search_results' ).empty();
            var s_v = sch.get_v();
            var s_u = sch.get_u();
            if( s_v.length || s_u ){
                var shit = $( data );
                var list = shit.find( '#forum_' + sch.fid() ).find( 'tbody' );
                shit.remove();
                if( list.length > 0 ){
                    var f = 0;
                    list.each(
                        function( i ){
                            var tds = $( this ).find( 'tr' ).children();
                            var p = tds.eq(2).find( 'a' );
                            var u = tds.eq(3).find( 'a' );
                            var str_p = p.html() || '';
                            var str_u = u.html() || '';
                            var f_p = 0;
                            var f_u = 0;
                            if( s_v.length ){
                                if(
                                    s_v.every(
                                        function( x ){
                                            return str_p.indexOf( x ) != -1;
                                        }
                                    )
                                 ){
                                    f_p = 1;
                                }
                            }else{
                                f_p = 1;
                            }
                            if( s_u ){
                                if( str_u.indexOf( s_u ) != -1 ){
                                    f_u = 1;
                                }
                            }else{
                                f_u = 1;
                            }
                            if( f_p && f_u ){
                                f++;
                                o.append( '<div class="p"><a href="' +p.prop( 'href' )+ '" target="_blank">' +p.html()+ '</a> <a class="u" href="' +u.prop( 'href' )+ '" target="_blank">' +u.html()+ '</a></div>' );
                            }
                        }
                    );
                    if( f < 1 ){
                        if( sch.p < sch.max_p() ){
                            sch.msg( '当前页没有结果，搜索下一页...' );
                            if( !sch.s ){
                                sch.next();
                            }else{
                                sch.s = 0;
                                sch.msg( '搜索已停止' );
                            }
                        }
                    }
                }else{
                    sch.msg( '该页没有得到任何帖子信息，搜索停止' );
                }
            }else{
                sch.msg( '关键字和用户名不能同时为空' );
            }
        },
        msg: function( s ){
            $( '#tgut_search_results' ).empty().html( '<div class="e">' +s+ '</div>' );
        },


        init: function(){
            var o = $( '#logo' ).parent().find( 'cite:first' ).parent();
            //if( o.html().indexOf( '搜索' ) < 0 ){
                var j = new $( '<div class="tgut-but">暴力搜索</div>' );
                j.click( sch.show );
                o.append( j );
            //}
        }
    };

    tg.init();

})();