// ==UserScript==
// @name         学堂在线 xuetangx.com 批量下载视频及字幕 Aria2脚本
// @namespace    mudan_cn
// @version      2019.9.14
// @description  1.提取视频和字幕的链接 2.按照上下文自动生成文件名 3.点击按钮通过 JSON-RPC 调用 aria2 下载至指定文件夹
// @author       mudan_cn
// @match        http://www.xuetangx.com/courses/**
// @match        https://www.xuetangx.com/courses/**
// @license      MIT License
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/390133/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%20xuetangxcom%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E5%8F%8A%E5%AD%97%E5%B9%95%20Aria2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/390133/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%20xuetangxcom%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E5%8F%8A%E5%AD%97%E5%B9%95%20Aria2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

$('div.course_mask').remove();
class Aria2Config {
}
const default_aria2_config = {
    uri: 'http://localhost:6800/jsonrpc',
    token: '',
    storage_directory: 'D:\\\\'
};
let counter = 0;
const id = setInterval(() => {
    try {
        const unit = $('.active.ui-accordion-header')[0].textContent.trim().replace(' ', ' ');
        const section = $('#accordion li.active p:first')[0].firstChild.textContent.trim().replace(' ', ' ');
        const videos = $('.xt_video_player').map((i, x) => x.getAttribute('src')).get();
        const transcripts = $('a[href$="transcript/download"]').map((i, x) => 'http://www.xuetangx.com' + x.getAttribute('href')).get();
        counter++;
        //loop and wait for the next turn
        if (videos.length < transcripts.length && counter < 10)
            return;
        //time out ,give up
        if (videos.length < transcripts.length && counter == 10) {
            clearInterval(id);
            console.error('视频地址加载失败');
        }
        clearInterval(id);
        console.log(`video ready, clear Interval\nvideos:${videos.length}\ntranscripts:${transcripts.length}`);
        console.log(videos);
        console.log(transcripts);
        //get_section_index
        const current_chapter = $('.chapter.is-open');
        const current_section = current_chapter.find('li.active');
        const section_index = ($('.chapter').index(current_chapter) + 1) + '.' + (current_section.parent().children().index(current_section) + 1);
        const video_title_node = $('#seq_content > div > div > div.vert.vert-0 > div > h2');
        //aria2 config settings
        let aria2_config = GM_getValue('aria2_config', default_aria2_config);
        console.log('current saved aria2_config:');
        console.log(aria2_config);
        $(`
            <div>
                <button id="configure_aria2_button" style="margin-bottom: 20px;">配置 aria2</button>
                <div id="configure_aria2_panel" style="display: none;margin: 0.5em;">
                    uri: <input id="aria2_uri" value="${aria2_config.uri}"><br>
                    token: <input id="aria2_token" value="${aria2_config.token}"><br>
                    storage_directory: <input id="aria2_storage_directory" value="${aria2_config.storage_directory}"><br>
                    <button id="save_aria2_settings_button" style="margin-bottom: 20px;">保存</button>
                </div>
            </div>
        `.replace(/ {4,}/g, '')).insertBefore(video_title_node);
        const configure_button = $('#configure_aria2_button');
        const configure_panel = $('#configure_aria2_panel');
        configure_button.on('click', () => {
            configure_panel.show();
            configure_button.css('color', 'black');
        });
        $('#save_aria2_settings_button').on('click', () => {
            aria2_config = {
                uri: $('#aria2_uri').val().toString(),
                token: $('#aria2_token').val().toString(),
                storage_directory: $('#aria2_storage_directory').val().toString()
            };
            GM_setValue('aria2_config', aria2_config);
            configure_button.css('color', 'green');
            configure_panel.hide();
            console.log('new aria2_config saved');
            console.log(aria2_config);
        });
        //build download buttons and actions
        videos.forEach((x, i) => {
            draw_buttons_and_links(x, get_file_name('mp4', videos.length > 1 ? (i + 1) : null), 'mp4');
        });
        transcripts.forEach((x, i) => {
            draw_buttons_and_links(x, get_file_name('srt', transcripts.length > 1 ? (i + 1) : null), 'srt');
        });
        function get_file_name(suffix, index) {
            return `${section_index} ${unit} ${section}${index ? ' ' + index : ''}.${suffix}`;
        }
        function draw_buttons_and_links(uri, file_name, suffix='') {
            $(` <div style="margin-top: 15px;margin-bottom: 15px;">
                    <p style="margin-bottom: 0.3em;">${file_name}</p>
                    <button class="BtnAria" style="margin-top: 10px;display: inline-block;">ARIA2 RPC</button>
                    <button class="BtnBatchdown" style="margin-top: 10px;display: inline-block;">批量下载</button>
                    <a href="${uri}" style="margin-top: 10px;display: inline-block;line-height: 55px;padding-left: 30px;" download="${file_name}">下载链接</a>
                </div>
            `.replace(/ {4,}/g, '')).on('click', 'button.BtnAria', (event) => {
                let success_button = event.target;
                console.log('success_button');
                send_aria2_download_rpc(uri, file_name, GM_getValue('aria2_config', default_aria2_config), (rpc_response) => {
                    try {
                        console.log('rpc sent successfully, server reply:');
                        console.log(rpc_response);
                        if (rpc_response.result) {
                            success_button.style.color = 'green';
                        }
                    }
                    catch (any) {
                        console.error(rpc_response);
                    }
                }, (json_rpc_sent, jqXHR, textStatus, errorThrown) => {
                    console.error('error in send_aria2_download_rpc');
                    console.log(aria2_config);
                    console.log(json_rpc_sent);
                    console.log(jqXHR);
                    alert('aria2 rpc 发送失败，请检查console日志');
                });
            }).on('click', 'button.BtnBatchdown', (event)=>{
                if(!$('#win_batchdown').length){
                    var chapters=$('div.chapter');
                    $(`<div id="win_batchdown" style="background-color:white;position:fixed;z-index:99999;top:1%;left:30%;max-width:40%;max-height:87.7%;overflow:auto">
                           <button onclick="$(this.parentNode).hide()">×</button> <button class="BtnBatchAria">发送到ARIA2</button>
                           <button onclick="$(this.parentNode).find('input').prop('checked',true)" class=all>全选</button>
                           <button onclick="$(this.parentNode).find('input').click()" class=reverse>反选</button><br>
                           <input checked type=checkbox class=mp4>mp4 <input checked type=checkbox class=srt>srt<br>
                       </div>`).appendTo($('body')).on('click', '.BtnBatchAria', function(eve){
                        $('#win_batchdown').find('a').each(function(i,e){
                            if(e.previousElementSibling.checked){
                                e = $(e);
                                $.get(e.attr('href'), function(res){
                                    $($(res).find('div.seq_contents').text()).find('div.video').each(function(i,d){
                                        d = $(d);
                                        if($('input.mp4').prop('checked'))
                                            $.getJSON('http://www.xuetangx.com/videoid2source/' + d.attr('data-ccsource'),function(json){
                                                send_aria2_download_rpc(json.sources.quality20[0],
                                                                        (e.text()+' '+i+d.siblings('h2').text()).replace(':','：')+'.mp4',
                                                                        GM_getValue('aria2_config', default_aria2_config),
                                                                        (res)=>{console.log(res)},(err)=>{console.error(err)});
                                            });
                                        if($('input.srt').prop('checked'))
                                            send_aria2_download_rpc('http://www.xuetangx.com'+d.find('li.video-tracks.video-download-button>a').attr('href'),
                                                                    (e.text()+' '+i+d.siblings('h2').text()).replace(':','：')+'.srt',
                                                                    GM_getValue('aria2_config', default_aria2_config),
                                                                    (res)=>{console.log(res)},(err)=>{console.error(err)});
                                    });
                                },'html');
                            }
                        })
                    });
                    chapters.each(function(i, e){//每个章节
                        var filename, iChapter = i+1, chname = $(e).find('h3>a').text();
                        $(e).find('li>a').each(function(i, e){//每节课程
                            var iLesson = i+1;
                            e = $(e);
                            filename = `${iChapter}.${iLesson} ${chname} ${e.find('p')[0].firstChild.textContent.trim()}`;
                            $(`<input type=checkbox><a target=_blank href="${e.attr('href')}">${filename}</a><br/>`).appendTo($('#win_batchdown'));
                        });
                    });
                }
                else
                    $('#win_batchdown').show();
            }).insertBefore(video_title_node);
        }
    }
    catch (any) {
        console.log(any);
        clearInterval(id);
    }
}, 1000);
//send json-rpc(with cookie) to aria2
function send_aria2_download_rpc(uri, filename, aria2_config, success_callback, error_callback) {
    const json_rpc = {
        id: '',
        jsonrpc: '2.0',
        method: 'aria2.addUri',
        params: [
            `token:${aria2_config.token}`,
            [uri],
            {
                dir: aria2_config.storage_directory,
                out: filename,
                header: ['Cookie: ' + document.cookie]
            }
        ]
    };
    $.ajax({
        url: aria2_config.uri,
        //method:'POST' can only be used after jQuery 2.0
        type: 'POST',
        crossDomain: true,
        processData: false,
        data: JSON.stringify(json_rpc),
        contentType: 'application/json',
        success: success_callback,
        error: (jqXHR, textStatus, errorThrown) => {
            error_callback(json_rpc, jqXHR, textStatus, errorThrown);
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsdUNBQXVDO0FBQ3ZDLGdEQUFnRDtBQUNoRCxnQ0FBZ0M7QUFDaEMsc0ZBQXNGO0FBQ3RGLG9CQUFvQjtBQUNwQixpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCLG1EQUFtRDtBQUNuRCxvREFBb0Q7QUFDcEQsOEZBQThGO0FBQzlGLDRCQUE0QjtBQUM1Qiw4QkFBOEI7QUFDOUIsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QiwyRUFBMkU7QUFDM0Usa0JBQWtCO0FBQ2xCO0NBSUM7QUFFRCxNQUFNLG9CQUFvQixHQUFhO0lBQ25DLEdBQUcsRUFBQywrQkFBK0I7SUFDbkMsS0FBSyxFQUFDLEVBQUU7SUFDUixpQkFBaUIsRUFBQyxRQUFRO0NBQzdCLENBQUE7QUFJRCxJQUFJLE9BQU8sR0FBQyxDQUFDLENBQUE7QUFDYixNQUFNLEVBQUUsR0FBQyxXQUFXLENBQUM7SUFDakIsSUFBRyxDQUFDO1FBQ0EsTUFBTSxJQUFJLEdBQUMsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUE7UUFDbEYsTUFBTSxPQUFPLEdBQUMsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2pHLE1BQU0sTUFBTSxHQUFnQixDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FB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RCxDQUFDO0tBQ0osQ0FBQyxDQUFBO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09VXNlclNjcmlwdD09XG4vLyBAbmFtZSAgICAgICAgIOWtpuWgguWcqOe6vyDor77nqIvop4bpopHlj4rlrZfluZUgYXJpYTLkuIvovb3ohJrmnKxcbi8vIEBuYW1lc3BhY2UgICAgaHR0cHM6Ly9naXRodWIuY29tL1NoZW5Ib25nRmVpL1xuLy8gQHZlcnNpb24gICAgICAyMDE3LjguMjcuMTkuMTBcbi8vIEBkZXNjcmlwdGlvbiAgMS7mj5Dlj5bop4bpopHlkozlrZfluZXnmoTpk77mjqU8YnI+Mi7mjInnhafkuIrkuIvmlofoh6rliqjnlJ/miJDmlofku7blkI08YnI+My7ngrnlh7vmjInpkq7pgJrov4cgSk9TTi1SUEMg6LCD55SoIGFyaWEyIOS4i+i9veiHs+aMh+WumuaWh+S7tuWkuVxuLy8gQGF1dGhvciAgICAgICDmsojpuL/po55cbi8vIEBob21lcGFnZVVSTCAgXG4vLyBAdXBkYXRlVVJMICAgIFxuLy8gQG1hdGNoICAgICAgICBodHRwOi8vd3d3Lnh1ZXRhbmd4LmNvbS9jb3Vyc2VzLyoqXG4vLyBAbWF0Y2ggICAgICAgIGh0dHBzOi8vd3d3Lnh1ZXRhbmd4LmNvbS9jb3Vyc2VzLyoqXG4vLyBAaWNvbiAgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9TaGVuSG9uZ0ZlaS94dWV0YW5neC1hcmlhMi1kb3dubG9hZC11c2Vyc2NyaXB0L2Zhdmljb24ucG5nXG4vLyBAbGljZW5zZSAgICAgIE1JVCBMaWNlbnNlXG4vLyBAcnVuLWF0ICAgICAgIGRvY3VtZW50LWlkbGVcbi8vIEBncmFudCAgICAgICAgR01fZ2V0VmFsdWVcbi8vIEBncmFudCAgICAgICAgR01fc2V0VmFsdWVcbi8vIEBfcmVxdWlyZSAgICAgIGZpbGU6Ly9FOlxcU0RLXFx4dWV0YW5neC1hcmlhMi1kb3dubG9hZC11c2Vyc2NyaXB0XFxpbmRleC5qc1xuLy8gPT0vVXNlclNjcmlwdD09XG5jbGFzcyBBcmlhMkNvbmZpZ3tcbiAgICB1cmk6c3RyaW5nXG4gICAgdG9rZW46c3RyaW5nXG4gICAgc3RvcmFnZV9kaXJlY3Rvcnk6c3RyaW5nXG59XG5cbmNvbnN0IGRlZmF1bHRfYXJpYTJfY29uZmlnOkFyaWEyQ29uZmlnPXtcbiAgICB1cmk6J2h0dHA6Ly9sb2NhbGhvc3Q6NjgwMC9qc29ucnBjJyxcbiAgICB0b2tlbjonJyxcbiAgICBzdG9yYWdlX2RpcmVjdG9yeTonRDpcXFxcXFxcXCdcbn1cbmRlY2xhcmUgZnVuY3Rpb24gR01fZ2V0VmFsdWUobmFtZTpzdHJpbmcsZGVmYXVsdFZhbHVlOmFueSk6YW55XG5kZWNsYXJlIGZ1bmN0aW9uIEdNX3NldFZhbHVlKG5hbWU6c3RyaW5nLHZhbHVlOmFueSk6YW55XG5cbmxldCBjb3VudGVyPTBcbmNvbnN0IGlkPXNldEludGVydmFsKCgpPT57XG4gICAgdHJ5e1xuICAgICAgICBjb25zdCB1bml0PSQoJy5hY3RpdmUudWktYWNjb3JkaW9uLWhlYWRlcicpWzBdLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKCfCoCcsJyAnKVxuICAgICAgICBjb25zdCBzZWN0aW9uPSQoJyNhY2NvcmRpb24gbGkuYWN0aXZlIHA6Zmlyc3QnKVswXS5maXJzdENoaWxkLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKCfCoCcsJyAnKVxuICAgICAgICBjb25zdCB2aWRlb3M9PHN0cmluZ1tdPjxhbnk+JCgnLnh0X3ZpZGVvX3BsYXllcicpLm1hcCgoaSx4KT0+eC5nZXRBdHRyaWJ1dGUoJ3NyYycpKS5nZXQoKVxuICAgICAgICBjb25zdCB0cmFuc2NyaXB0cz08c3RyaW5nW10+PGFueT4kKCdhW2hyZWYkPVwidHJhbnNjcmlwdC9kb3dubG9hZFwiXScpLm1hcCgoaSx4KT0+J2h0dHA6Ly93d3cueHVldGFuZ3guY29tJyt4LmdldEF0dHJpYnV0ZSgnaHJlZicpKS5nZXQoKVxuICAgICAgICBcbiAgICAgICAgY291bnRlcisrXG4gICAgICAgIC8vbG9vcCBhbmQgd2FpdCBmb3IgdGhlIG5leHQgdHVyblxuICAgICAgICBpZih2aWRlb3MubGVuZ3RoPHRyYW5zY3JpcHRzLmxlbmd0aCYmY291bnRlcjwxMCkgcmV0dXJuXG4gICAgICAgIC8vdGltZSBvdXQgLGdpdmUgdXBcbiAgICAgICAgaWYodmlkZW9zLmxlbmd0aDx0cmFuc2NyaXB0cy5sZW5ndGgmJmNvdW50ZXI9PTEwKXtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaWQpXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCfop4bpopHlnLDlnYDliqDovb3lpLHotKUnKVxuICAgICAgICB9XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaWQpXG4gICAgICAgIGNvbnNvbGUubG9nKGB2aWRlbyByZWFkeSwgY2xlYXIgSW50ZXJ2YWxcXG52aWRlb3M6JHt2aWRlb3MubGVuZ3RofVxcbnRyYW5zY3JpcHRzOiR7dHJhbnNjcmlwdHMubGVuZ3RofWApXG4gICAgICAgIGNvbnNvbGUubG9nKHZpZGVvcylcbiAgICAgICAgY29uc29sZS5sb2codHJhbnNjcmlwdHMpXG4gICAgICAgIC8vZ2V0X3NlY3Rpb25faW5kZXhcbiAgICAgICAgY29uc3QgY3VycmVudF9jaGFwdGVyPSQoJy5jaGFwdGVyLmlzLW9wZW4nKVxuICAgICAgICBjb25zdCBjdXJyZW50X3NlY3Rpb249Y3VycmVudF9jaGFwdGVyLmZpbmQoJ2xpLmFjdGl2ZScpXG4gICAgICAgIGNvbnN0IHNlY3Rpb25faW5kZXg6c3RyaW5nPSgkKCcuY2hhcHRlcicpLmluZGV4KGN1cnJlbnRfY2hhcHRlcikrMSkrJy4nKyhjdXJyZW50X3NlY3Rpb24ucGFyZW50KCkuY2hpbGRyZW4oKS5pbmRleChjdXJyZW50X3NlY3Rpb24pKzEpXG4gICAgICAgIFxuICAgICAgICBjb25zdCB2aWRlb190aXRsZV9ub2RlPSQoJyNzZXFfY29udGVudCA+IGRpdiA+IGRpdiA+IGRpdi52ZXJ0LnZlcnQtMCA+IGRpdiA+IGgyJylcbiAgICAgICAgXG4gICAgICAgIC8vYXJpYTIgY29uZmlnIHNldHRpbmdzXG4gICAgICAgIGxldCBhcmlhMl9jb25maWc6QXJpYTJDb25maWc9R01fZ2V0VmFsdWUoJ2FyaWEyX2NvbmZpZycsZGVmYXVsdF9hcmlhMl9jb25maWcpXG4gICAgICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IHNhdmVkIGFyaWEyX2NvbmZpZzonKVxuICAgICAgICBjb25zb2xlLmxvZyhhcmlhMl9jb25maWcpXG4gICAgICAgICQoYFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiY29uZmlndXJlX2FyaWEyX2J1dHRvblwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMjBweDtcIj7phY3nva4gYXJpYTI8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY29uZmlndXJlX2FyaWEyX3BhbmVsXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO21hcmdpbjogMC41ZW07XCI+XG4gICAgICAgICAgICAgICAgICAgIHVyaTogPGlucHV0IGlkPVwiYXJpYTJfdXJpXCIgdmFsdWU9XCIke2FyaWEyX2NvbmZpZy51cml9XCI+PGJyPlxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogPGlucHV0IGlkPVwiYXJpYTJfdG9rZW5cIiB2YWx1ZT1cIiR7YXJpYTJfY29uZmlnLnRva2VufVwiPjxicj5cbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZV9kaXJlY3Rvcnk6IDxpbnB1dCBpZD1cImFyaWEyX3N0b3JhZ2VfZGlyZWN0b3J5XCIgdmFsdWU9XCIke2FyaWEyX2NvbmZpZy5zdG9yYWdlX2RpcmVjdG9yeX1cIj48YnI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYXZlX2FyaWEyX3NldHRpbmdzX2J1dHRvblwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMjBweDtcIj7kv53lrZg8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgLnJlcGxhY2UoLyB7NCx9L2csJycpXG4gICAgICAgICkuaW5zZXJ0QmVmb3JlKHZpZGVvX3RpdGxlX25vZGUpXG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyZV9idXR0b249JCgnI2NvbmZpZ3VyZV9hcmlhMl9idXR0b24nKVxuICAgICAgICBjb25zdCBjb25maWd1cmVfcGFuZWw9JCgnI2NvbmZpZ3VyZV9hcmlhMl9wYW5lbCcpXG4gICAgICAgIGNvbmZpZ3VyZV9idXR0b24ub24oJ2NsaWNrJywoKT0+e1xuICAgICAgICAgICAgY29uZmlndXJlX3BhbmVsLnNob3coKVxuICAgICAgICAgICAgY29uZmlndXJlX2J1dHRvbi5jc3MoJ2NvbG9yJywnYmxhY2snKVxuICAgICAgICB9KVxuICAgICAgICAkKCcjc2F2ZV9hcmlhMl9zZXR0aW5nc19idXR0b24nKS5vbignY2xpY2snLCgpPT57XG4gICAgICAgICAgICBhcmlhMl9jb25maWc9e1xuICAgICAgICAgICAgICAgIHVyaTokKCcjYXJpYTJfdXJpJykudmFsKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICB0b2tlbjokKCcjYXJpYTJfdG9rZW4nKS52YWwoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIHN0b3JhZ2VfZGlyZWN0b3J5OiQoJyNhcmlhMl9zdG9yYWdlX2RpcmVjdG9yeScpLnZhbCgpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdNX3NldFZhbHVlKCdhcmlhMl9jb25maWcnLGFyaWEyX2NvbmZpZylcbiAgICAgICAgICAgIGNvbmZpZ3VyZV9idXR0b24uY3NzKCdjb2xvcicsJ2dyZWVuJylcbiAgICAgICAgICAgIGNvbmZpZ3VyZV9wYW5lbC5oaWRlKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgYXJpYTJfY29uZmlnIHNhdmVkJylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyaWEyX2NvbmZpZylcbiAgICAgICAgfSlcbiAgICAgICAgLy9idWlsZCBkb3dubG9hZCBidXR0b25zIGFuZCBhY3Rpb25zXG4gICAgICAgIHZpZGVvcy5mb3JFYWNoKCh4LGkpPT57XG4gICAgICAgICAgICBkcmF3X2J1dHRvbnNfYW5kX2xpbmtzKHgsZ2V0X2ZpbGVfbmFtZSgnbXA0Jyx2aWRlb3MubGVuZ3RoPjE/KGkrMSk6bnVsbCkpXG4gICAgICAgIH0pXG4gICAgICAgIHRyYW5zY3JpcHRzLmZvckVhY2goKHgsaSk9PntcbiAgICAgICAgICAgIGRyYXdfYnV0dG9uc19hbmRfbGlua3MoeCxnZXRfZmlsZV9uYW1lKCdzcnQnLHRyYW5zY3JpcHRzLmxlbmd0aD4xPyhpKzEpOm51bGwpKVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gZ2V0X2ZpbGVfbmFtZShzdWZmaXg6c3RyaW5nLGluZGV4PzpudW1iZXIpe1xuICAgICAgICAgICAgcmV0dXJuIGAke3NlY3Rpb25faW5kZXh9ICR7dW5pdH0gJHtzZWN0aW9ufSR7aW5kZXg/JyAnK2luZGV4OicnfS4ke3N1ZmZpeH1gXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZHJhd19idXR0b25zX2FuZF9saW5rcyh1cmk6c3RyaW5nLGZpbGVfbmFtZTpzdHJpbmcpOnZvaWR7XG4gICAgICAgICAgICAkKGBcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDogMTVweDttYXJnaW4tYm90dG9tOiAxNXB4O1wiPlxuICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDAuM2VtO1wiPiR7ZmlsZV9uYW1lfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT1cIm1hcmdpbi10b3A6IDEwcHg7ZGlzcGxheTogaW5saW5lLWJsb2NrO1wiPkFSSUEyIFJQQzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHt1cml9XCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAxMHB4O2Rpc3BsYXk6IGlubGluZS1ibG9jaztsaW5lLWhlaWdodDogNTVweDtwYWRkaW5nLWxlZnQ6IDMwcHg7XCIgZG93bmxvYWQ9XCIke2ZpbGVfbmFtZX1cIj7kuIvovb3pk77mjqU8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgLnJlcGxhY2UoLyB7NCx9L2csJycpKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbicsKGV2ZW50KT0+e1xuICAgICAgICAgICAgICAgIGxldCBzdWNjZXNzX2J1dHRvbj1ldmVudC50YXJnZXRcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3VjY2Vzc19idXR0b24nKVxuICAgICAgICAgICAgICAgIHNlbmRfYXJpYTJfZG93bmxvYWRfcnBjKFxuICAgICAgICAgICAgICAgICAgICB1cmksXG4gICAgICAgICAgICAgICAgICAgIGZpbGVfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgR01fZ2V0VmFsdWUoJ2FyaWEyX2NvbmZpZycsZGVmYXVsdF9hcmlhMl9jb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAocnBjX3Jlc3BvbnNlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdycGMgc2VudCBzdWNjZXNzZnVsbHksIHNlcnZlciByZXBseTonKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJwY19yZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihycGNfcmVzcG9uc2UucmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc19idXR0b24uc3R5bGUuY29sb3I9J2dyZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1jYXRjaChhbnkpe2NvbnNvbGUuZXJyb3IocnBjX3Jlc3BvbnNlKX1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKGpzb25fcnBjX3NlbnQsanFYSFI6SlF1ZXJ5WEhSLHRleHRTdGF0dXM6c3RyaW5nLGVycm9yVGhyb3duOnN0cmluZyk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGluIHNlbmRfYXJpYTJfZG93bmxvYWRfcnBjJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyaWEyX2NvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb25fcnBjX3NlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhqcVhIUilcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdhcmlhMiBycGMg5Y+R6YCB5aSx6LSl77yM6K+35qOA5p+lY29uc29sZeaXpeW/lycpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmluc2VydEJlZm9yZSh2aWRlb190aXRsZV9ub2RlKVxuICAgICAgICB9XG4gICAgfWNhdGNoKGFueSl7XG4gICAgICAgIGNvbnNvbGUubG9nKGFueSlcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpZClcbiAgICB9XG59LDEwMDApXG5cbi8vc2VuZCBqc29uLXJwYyh3aXRoIGNvb2tpZSkgdG8gYXJpYTJcbmZ1bmN0aW9uIHNlbmRfYXJpYTJfZG93bmxvYWRfcnBjKFxuICAgIHVyaTpzdHJpbmcsXG4gICAgZmlsZW5hbWU6c3RyaW5nLFxuICAgIGFyaWEyX2NvbmZpZzpBcmlhMkNvbmZpZyxcbiAgICBzdWNjZXNzX2NhbGxiYWNrPzoocnBjX3Jlc3BvbnNlOmFueSk9PnZvaWQsXG4gICAgZXJyb3JfY2FsbGJhY2s/Oihqc29uX3JwY19zZW50Om9iamVjdCxqcVhIUjpKUXVlcnlYSFIsdGV4dFN0YXR1czpzdHJpbmcsZXJyb3JUaHJvd246c3RyaW5nKT0+dm9pZFxuKXtcbiAgICBjb25zdCBqc29uX3JwYz17XG4gICAgICAgIGlkOicnLFxuICAgICAgICBqc29ucnBjOicyLjAnLFxuICAgICAgICBtZXRob2Q6J2FyaWEyLmFkZFVyaScsXG4gICAgICAgIHBhcmFtczpbXG4gICAgICAgICAgICBgdG9rZW46JHthcmlhMl9jb25maWcudG9rZW59YCxcbiAgICAgICAgICAgIFt1cmldLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpcjphcmlhMl9jb25maWcuc3RvcmFnZV9kaXJlY3RvcnksXG4gICAgICAgICAgICAgICAgb3V0OmZpbGVuYW1lLFxuICAgICAgICAgICAgICAgIGhlYWRlcjpbJ0Nvb2tpZTogJytkb2N1bWVudC5jb29raWVdXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9XG4gICAgJC5hamF4KHtcbiAgICB1cmw6YXJpYTJfY29uZmlnLnVyaSxcbiAgICAvL21ldGhvZDonUE9TVCcgY2FuIG9ubHkgYmUgdXNlZCBhZnRlciBqUXVlcnkgMi4wXG4gICAgdHlwZTonUE9TVCcsXG4gICAgY3Jvc3NEb21haW46dHJ1ZSxcbiAgICBwcm9jZXNzRGF0YTpmYWxzZSxcbiAgICBkYXRhOkpTT04uc3RyaW5naWZ5KGpzb25fcnBjKSxcbiAgICBjb250ZW50VHlwZTonYXBwbGljYXRpb24vanNvbicsXG4gICAgc3VjY2VzczpzdWNjZXNzX2NhbGxiYWNrLFxuICAgIGVycm9yOihqcVhIUjpKUXVlcnlYSFIsdGV4dFN0YXR1czpzdHJpbmcsZXJyb3JUaHJvd246c3RyaW5nKT0+e1xuICAgICAgICBlcnJvcl9jYWxsYmFjayhqc29uX3JwYyxqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKVxuICAgIH0sXG59KVxufSJdfQ==