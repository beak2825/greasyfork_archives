// ==UserScript==
// @name         upload_btn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  help auto-feed support btn
// @author       tomorrow505
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// ==/UserScript==

if (GM_getValue('btn_info') !== undefined) {
    raw_info = JSON.parse(GM_getValue('btn_info'));
    raw_info = fill_raw_info(raw_info);
    if ($('#post').parent().parent().parent().parent().css('display') != 'none') {
       
        $('#content').find('table').first().hide();
        $('td.label:contains(Actors)').parent().after($(`<tr><td class="label">IMDB</td>
            <td><input type="text" id="imdbid" name="imdbid" size="60" />
            <input id="fill" type="button" value="辅助填写">
            </td></tr>`));
        $('#imdbid').val(raw_info.url);
        $('#scenename').val(raw_info.name);
        $('#release_desc').val(raw_info.descr.replace(/\[.{3,15}\]/g, '').trim());
        setTimeout(function() {
            $('#fill').click(function(){
                var name = $('#scenename').val().trim();
                var title = $('#title').val().trim();
                if (title == name.replace(/ /g, '.')) {
                    if (name.match(/E\d+/i) && !name.match(/S\d+E\d+/i)) {
                        name = name.replace(/(E\d+)/, 'S01$1');
                        $('#title').val('S01' + title.match(/E\d+/)[0])
                    }
                }
                var tv_series = $('#artist').val();
                if (!tv_series.match(/(19|20)\d{2}/) && name.match(/(19|20)\d{2}[^pP]/)) {
                    name = name.replace(/(19|20)\d{2}/, '').replace(/ +/, ' ');
                }
                try{
                    var channels = raw_info.descr.match(/Channel.*?(\d).*?channels/)[1];
                    var label = null;
                    var label_str = '';
                    if (channels == '1') {
                        label = /1\.0/;
                        label_str = '1.0';
                    } else if (channels == '2') {
                        label = /2\.0/;
                        label_str = '2.0';
                    } else if (channels == '6') {
                        label = /5\.1/;
                        label_str = '5.1';
                    } else if (channels == '8') {
                        label = /7\.1/;
                        label_str = '7.1';
                    }
                    if (!name.match(label)) {
                        name = name.replace(/(DDPA|AAC|DDP|FLAC|DTS|LPCM|TrueHD)/, `$1${label_str}`);
                    }

                    if (name.match(/(H.265|H.264).(DDPA|AAC|DDP|FLAC|DTS|LPCM|TrueHD)(2\.0|1\.0|5\.1|7\.1)/)) {
                        name = name.replace(/(H.265|H.264).(DDPA|AAC|DDP|FLAC|DTS|LPCM|TrueHD)(2\.0|1\.0|5\.1|7\.1)/, '$2 $3 $1')
                    }

                } catch(err) {alert(err)} 
                $('#scenename').val(name.replace(/ /g, '.'));
                $('#origin').val('P2P');

                var info = $('#album_desc').val();
                if (!info.match(/Season/)) {
                    info = `[b]Episode Name: [/b]\n[b]Season: {s} [/b]\n[b]Episode: {e} [/b]\n[b]Aired: [/b]\n\n[b]Episode Overview: [/b]`;
                    console.log(name)
                    try {
                        info = info.format({'s': parseInt(name.match(/S(\d+)/)[1])});
                        info = info.format({'e': parseInt(name.match(/E(\d+)/)[1])});
                        $('#album_desc').val(info);
                    } catch (err) {
                        console.log(err)
                    }
                }

                var codec = name.codec_sel();
                if (codec == 'H264' || codec == 'X264') {
                    $('#bitrate').val('H.264');
                } else if (codec == 'H265' || codec == 'X265') {
                    $('#bitrate').val('H.265');
                }
                var medium = name.medium_sel();
                if (medium == 'HDTV') {
                    $('#media').val('HDTV');
                } else if (medium == 'WEB-DL') {
                    $('#media').val('WEB-DL');
                }
                var standard = name.standard_sel();
                if (standard == '720p') {
                    $('#resolution').val('720p');
                } else if (standard == '1080p') {
                    $('#resolution').val('1080p');
                } else if (standard == '1080i') {
                    $('#resolution').val('1080i');
                } else if (standard == '4K') {
                    $('#resolution').val('2160p');
                }

                var mediainfo = $('#release_desc').val();
                if (mediainfo.match(/\.mp4/)) {
                    $('#format').val('MP4');
                } else if (mediainfo.match(/\.mkv/)) {
                    $('#format').val('MKV');
                }
                $('#international_box').attr('checked', true);
                var url = $('#imdbid').val();
                if (url.match(/tt\d+/)) {
                    var imdb_url = 'https://www.imdb.com/title/' + url.match(/tt\d+/)[0];
                    getDoc(imdb_url, null, function(doc) {
                        var country = Array.from($('li.ipc-metadata-list__item:contains("Country")', doc).find('a')).map(function(e){
                            return $(e).text();
                        });
                        var country_selected = false;
                        country.map(function(e){
                            if (e == "UK") { e = 'United Kingdom'} else if (e == 'USA') { e = 'United States of America'}
                            if ($('#country').find(`option:contains(${e.trim()})`).length) {
                                if (!country_selected){
                                    country_selected = true;
                                    $('#country').find(`option:contains(${e.trim()})`).attr('selected', true);
                                }
                            }
                        });
                        var language = $('li[data-testid="title-details-languages"]', doc).find('a').text().trim();
                        if (language == 'English') {
                            $('#international_box').attr('checked', false);
                        }
                    })

                }
            });
        }, 500);

        $('#album_desc').css({'width': '600px', 'height': '200px'});
        $('#release_desc').css({'width': '600px', 'height': '500px'});
    } else {
        if (raw_info.name.match(/e\d+/i)) {
            $('#categories').val('Episode');
        } else {
            $('#categories').val('Season');
        }
        $('#scene_yesno').val('Yes');

        $('#autofill_scene_yes').css({'display': 'block'});
        $('#autofill').val(raw_info.name);
    }
}