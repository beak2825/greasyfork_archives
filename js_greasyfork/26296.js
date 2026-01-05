// ==UserScript==
// @name	   ErogameScape Music input
// @namespace  http://blueblueblue.fool.jp/
// @description  エロスケの音楽情報入力サポート
// @copyright  2016, ebi
// @version	1.2
// updateURL https://greasyfork.org/scripts/26296-erogamescape-music-input/code/ErogameScape%20Music%20input.user.js
// @include	http://erogamescape*/~ap2/ero/toukei_kaiseki/mod_insert_creater_music.php?music_id=*
// @downloadURL https://update.greasyfork.org/scripts/26296/ErogameScape%20Music%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/26296/ErogameScape%20Music%20input.meta.js
// ==/UserScript==

function main() {
    var mynames = ['', '', '', ''];
    var mytypes_jp = ['歌手', '作詞', '作曲', '編曲'];
    var mytypes = ['singer', 'lyrics', 'composition', 'arrangement'];

	var msg=
		"<style type=\"text/css\">" +
		"   div#us-esmi-wrapper {" +
		"	 font-size:13px !important;" +
		"	 width:300px;" +
		"	 position:fixed;" +
		"	 right:5px;" +
		"	 top:5px;" +
		"	 background:rgba(240,240,240,0.8);" +
		"	 border:2px solid #7c7c7c;" +
		"	 margin:0px;" +
		"	 padding:0px;" +
		"	 text-align:left;" +
		"	 font-family: \"ヒラギノ角ゴ Pro W3\", \"メイリオ\", \"ＭＳ Ｐゴシック\",sans-serif;" +
		"   }" +
		"   #us-esmi-wrapper textarea, #us-esmi-wrapper input, #us-esmi-wrapper select, #us-esmi-title {" +
		"	 border:2px solid #7c7c7c;" +
		"	 margin:0px;" +
		"	 padding:3px;" +
		"   }" +
		"   #us-esmi-wrapper textarea {" +
		"	 display:block;" +
		"	 width:290px;" +
		"	 height:100px;" +
		"   }" +
		"   #us-esmi-wrapper input, #us-esmi-title {" +
		"	 display:block;" +
		"	 width:290px;" +
		"   }" +
		"   #us-esmi-wrapper select {" +
		"	 width:200px;" +
		"   }" +
		"   #us-esmi-title {" +
		"	 background:#000;" +
		"	 color:#fff;" +
		"   }" +
		"   #us-esmi-sql {" +
		"	 width:80%;" +
		"	 height:100px;" +
		"   }" +
		"</style>";
	$("body").append(msg);

    var div = $("<div></div>", {
                   id: "us-esmi-wrapper"
                 });
    var title = $("<div>ErogameScape Music input</div>", {
                   id: "us-esmi-title"
                 });
    div.append(title);
    var form = $("<form></form>", {
                   id: "us-esmi-form"
                 });
    var textarea = $("<textarea></textarea>", {
                   id: "us-esmi-textarea" ,
                 });
    form.append(textarea);
    var button = $("<input></input>", {
                   id: "us-esmi-button" ,
                   type: "button" ,
                   value: "検索"
                 });
    form.append(button);
    for (var i = 0; i < mytypes.length; i++ ) {
        form.append("<br />　" +mytypes_jp[i] + " : ");
        form.append("<select id=\"us-esmi-" + mytypes[i] + "\">");
    }

    div.append(form);
    $("body").append(div);

    var sql_result = $("<textarea></textarea>", {
                   id: "us-esmi-sql" ,
                 });
    $("body").append(sql_result);

    
    //set_id( mynames );

    function set_id( mynames ) {
    	var myQuery= "" +
    "   chr(60)||'!--start--'||chr(62)" + 
    
    "|| '{'" +

        "|| chr(34)||'singer'||chr(34)||':'" +
        "|| '['" + 
        "|| (SELECT COALESCE(string_agg('{'||chr(34)||'id'||chr(34)||': '||chr(34)||id||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||name||chr(34)||'}', ',') " +
        "   , '{'||chr(34)||'id'||chr(34)||': '||chr(34)||''||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||''||chr(34)||'}') "+
        "   FROM (SELECT cl.id, cl.name FROM createrlist AS cl LEFT JOIN shokushu AS ss ON cl.id = ss.creater AND ss.shubetu in (3, 6) WHERE name ~ '" + mynames[0] + "' GROUP BY cl.id, cl.name ORDER BY COUNT(*) DESC LIMIT 10) AS foo)" + 
        "|| ']'" + 
        "|| ','" + 
        
        "|| chr(34)||'lyrics'||chr(34)||':'" +
        "|| '['" + 
        "|| (SELECT COALESCE(string_agg('{'||chr(34)||'id'||chr(34)||': '||chr(34)||id||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||name||chr(34)||'}', ',') " +
        "   , '{'||chr(34)||'id'||chr(34)||': '||chr(34)||''||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||''||chr(34)||'}') "+
        "   FROM (SELECT cl.id, cl.name FROM createrlist AS cl LEFT JOIN shokushu AS ss ON cl.id = ss.creater AND ss.shubetu in (3, 6) WHERE name ~ '" + mynames[1] + "' GROUP BY cl.id, cl.name ORDER BY COUNT(*) DESC LIMIT 10) AS foo)" + 
        "|| ']'" + 
        "|| ','" + 
        
        "|| chr(34)||'composition'||chr(34)||':'" +
        "|| '['" + 
        "|| (SELECT COALESCE(string_agg('{'||chr(34)||'id'||chr(34)||': '||chr(34)||id||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||name||chr(34)||'}', ',') " +
        "   , '{'||chr(34)||'id'||chr(34)||': '||chr(34)||''||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||''||chr(34)||'}') "+
        "   FROM (SELECT cl.id, cl.name FROM createrlist AS cl LEFT JOIN shokushu AS ss ON cl.id = ss.creater AND ss.shubetu in (3, 6) WHERE name ~ '" + mynames[2] + "' GROUP BY cl.id, cl.name ORDER BY COUNT(*) DESC LIMIT 10) AS foo)" + 
        "|| ']'" + 
        "|| ','" + 
        
        "|| chr(34)||'arrangement'||chr(34)||':'" +
        "|| '['" + 
        "|| (SELECT COALESCE(string_agg('{'||chr(34)||'id'||chr(34)||': '||chr(34)||id||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||name||chr(34)||'}', ',') " +
        "   , '{'||chr(34)||'id'||chr(34)||': '||chr(34)||''||chr(34)||','||chr(34)||'name'||chr(34)||': '||chr(34)||''||chr(34)||'}') "+
        "   FROM (SELECT cl.id, cl.name FROM createrlist AS cl LEFT JOIN shokushu AS ss ON cl.id = ss.creater AND ss.shubetu in (3, 6) WHERE name ~ '" + mynames[3] + "' GROUP BY cl.id, cl.name ORDER BY COUNT(*) DESC LIMIT 10) AS foo)" + 
        "|| ']'" + 
            
    "|| '}'" + 
    
    "|| chr(60)||'!--end--'||chr(62)";
    	$.ajax({
    	  type:"POST",
    	  url: "./select.php",
    	  data:{SQL: myQuery},
    	  success: function(msg,status){
    		msg = msg.substring(msg.indexOf("SELECTした結果のテーブル内容",0),msg.length);
    		msg = msg.substring(msg.indexOf("<!--start-->",0),msg.length);
    		msg = msg.substring(12,msg.indexOf("<!--end-->",0));
    		$("#us-esmi-sql").val("【Query】SELECT " + myQuery + "【Result】" + msg);
            var mydata = JSON.parse(msg);

            for (var i = 0; i < mytypes.length; i++ ) {
                $("#us-esmi-" + mytypes[i]).html("");
                for ( var j = 0; j < mydata[ mytypes[i] ].length; j++ ) {
                    if ( j === 0 ) $("#creater_id_" + mytypes[i]).val(mydata[ mytypes[i] ][j].id);
                    if ( j === 0 ) $("#creater_name_" + mytypes[i]).text(mydata[ mytypes[i] ][j].name);
                    if ( j === 0 ) {
                        $("#us-esmi-" + mytypes[i]).append("<option value=\"" + mydata[ mytypes[i] ][j].id + "\" selected>" + mydata[ mytypes[i] ][j].name + "</option>");
                    } else {
                        $("#us-esmi-" + mytypes[i]).append("<option value=\"" + mydata[ mytypes[i] ][j].id + "\">" + mydata[ mytypes[i] ][j].name + "</option>");
                    }
                }
            }
    	  }
    	});
    } //function set_id()


	$("#us-esmi-button").live('click', function() {
		var text = $("#us-esmi-textarea").val();
        var splt_text = text.split( /\n|\s+|\.|\:|\/|　+|、/ );
        splt_text = $.grep(splt_text, function(e){return e;});
        for (var i = 0; i < splt_text.length; i++ ) {
            if ( splt_text[i].toUpperCase().match(/歌手|歌唱|FEAT|SING/) ) mynames[0] = splt_text[i + 1];
            if ( splt_text[i].toUpperCase().match(/作詞|作詞作曲|LYRIC/) ) mynames[1] = splt_text[i + 1];
            if ( splt_text[i].toUpperCase().match(/作曲|作編曲|作詞作曲|COMPO/) ) mynames[2] = splt_text[i + 1];
            if ( splt_text[i].toUpperCase().match(/編曲|作編曲|ARRANGE/) ) mynames[3] = splt_text[i + 1];
        }
        for (var i = 0; i < mynames.length; i++ ) {
            if ( mynames[i].length < 1 ) mynames[i] = "該当するデータが取得できません";
        }
        set_id( mynames );
	});

	$("#us-esmi-singer").live('change', function() {
        $("#creater_id_singer").val($("#us-esmi-singer").val());
        $("#creater_name_singer").text($("#us-esmi-singer option:selected").text());
	});

	$("#us-esmi-lyrics").live('change', function() {
        $("#creater_id_lyrics").val($("#us-esmi-lyrics").val());
        $("#creater_name_lyrics").text($("#us-esmi-lyrics option:selected").text());
	});

	$("#us-esmi-composition").live('change', function() {
        $("#creater_id_composition").val($("#us-esmi-composition").val());
        $("#creater_name_composition").text($("#us-esmi-composition option:selected").text());
	});

	$("#us-esmi-arrangement").live('change', function() {
        $("#creater_id_arrangement").val($("#us-esmi-arrangement").val());
        $("#creater_name_arrangement").text($("#us-esmi-arrangement option:selected").text());
	});

} //function main()

function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
	script.addEventListener('load', function() {
	  var script = document.createElement("script");
	  script.textContent = "(" + callback.toString() + ")();";
	  document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

addJQuery(main);
