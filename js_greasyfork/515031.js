(function () {
    let a = document['getElementById']('yl_8') && document['getElementById']('yl_8')['onclick'] || jQuery;
    var b;
    var c;
    var d;
    var e = {
        'x':0,
        'y':0
    };
    GM_registerMenuCommand(b ? '关闭截图识别文字(shift+↓)' : '装载截图识别文字(shift+↑)', function () {
        b ? document['body']['removeEventListener']('mousedown', jietu_mouse) : jietu_onload();
        b = null;
    });
    document['addEventListener']('keydown', function (g) {
        if (g['shiftKey'] && g['key'] === 'ArrowUp') {
            jietu_onload();
        } else if (g['shiftKey'] && g['key'] === 'ArrowDown') {
            console['log']('shift\x20+\x20下\x20关闭截图');
            document['body']['removeEventListener']('mousedown', jietu_mouse);
        }
    });
    jietu_onload = g => {
        c = document['createElement']('div');
        c['className'] = 'select_box';
        let h =`
        .select_box {
            overflow: hidden; /* 隐藏超出的内容 */
            border: 1px dashed #f00;
            position: absolute;
            pointer-events: none;
            display:block;
            z-index:999;
            // background-color: #f0f0f0;
        }
        .select_box canvas{
            cursor : move;
            position: absolute;
            z-index:1;
        }
        .select_box *{
            pointer-events: none;
            width:100%;
            font-size: 12px;
            position: absolute;
            z-index:2;
            text-shadow: 0 0 gray;
        }
        `
         GM_addStyle(h);
        a('html')[0x0]['appendChild'](c);
        var i = ![];
        var j =0;
        var k =0;
        var l =0;
        var m =0;
        c['addEventListener']('mousedown', r => {
            i = !![];
            j = r['clientX'];
            k = r['clientY'];
            l = parseInt(b['style']['top']);
            m = parseInt(b['style']['left']);
        });
        var n =0;
        var o =0;
        c['addEventListener']('mousemove', r => {
            if (i) {
                n = r['clientX'];
                o = r['clientY'];
                b['style']['top'] = l - Math['floor'](k - o) + 'px';
                b['style']['left'] = m - Math['floor'](j - n) + 'px';
            }
        });
        c['addEventListener']('mouseup', () => {
            if (i && (n || o)) {
                e['y'] = e['y'] + Math['floor'](k - o);
                e['x'] = e['x'] + Math['floor'](j - n);
                console['log'](e);
                k = j = n = o =0;
            }
            i = ![];
        });
        console['log']('shift\x20+\x20上箭头被按下,更新截图页面');
        document['body']['addEventListener']('mousedown', jietu_mouse);
        f();
        const p = 'chi_sim';
        const q = 'https://unpkg.com/@tesseract.js-data/' + p + '/4.0.0_best_int';
        ((async () => {
            d = await Tesseract['createWorker'](p, 0x1, {
                'corePath': 'https://unpkg.com/tesseract.js-core@v5',
                'workerPath': 'https://unpkg.com/tesseract.js@v5/dist/worker.min.js',
                'langPath': q,
                'logger': function (r) {
                    console['log'](r);
                }
            });
        })());
    };
    jietu_mouse = g => {
        c['innerHTML'] = '';
        startX = g['pageX'];
        startY = g['pageY'];
        c['style']['left'] = startX + 'px';
        c['style']['top'] = startY + 'px';
        c['style']['width'] = '0px';
        c['style']['height'] = '0px';
        c['style']['display'] = 'block';
        document['body']['style']['cursor'] = 'crosshair';
        document['body']['style']['user-select'] = 'none';
        const h = j => {
            endX = j['pageX'];
            endY = j['pageY'];
            c['style']['width'] = Math['abs'](endX - startX) + 'px';
            c['style']['height'] = Math['abs'](endY - startY) + 'px';
            c['style']['left'] = Math['min'](startX, endX) + 'px';
            c['style']['top'] = Math['min'](startY, endY) + 'px';
        };
        const i = () => {
            document['body']['style']['cursor'] = 'default';
            document['body']['style']['user-select'] = 'text';
            document['removeEventListener']('mousemove', h);
            document['removeEventListener']('mouseup', i);
            var j;
            try {
                j = b['getContext']('2d');
            } catch {
                c['innerHTML'] = '<p>正在渲染图片请稍后重新框选</p>';
            }
            const k = parseInt(c['style']['width']);
            const l = parseInt(c['style']['height']);
            if (!k || !l) {
                return;
            }
            b['style']['pointer-events'] = 'auto';
            c['appendChild'](b);
            const m = parseInt(c['style']['left']);
            const n = parseInt(c['style']['top']);
            const o = j['getImageData']((m + e['x']) * 0x2, (n + e['y']) * 0x2, k * 0x2, l * 0x2);
            const p = document['createElement']('canvas');
            p['width'] = k * 0x2;
            p['height'] = l * 0x2;
            p['getContext']('2d')['putImageData'](o,0,0);
            base64 = p['toDataURL']()['replace'](/^data:image\/(png|jpg);base64,/, '');
            value = 'data:image/png;base64,' + base64;
            b['style']['top'] = -e['y'] - n + 'px';
            b['style']['left'] = -e['x'] - m + 'px';
            console['log'](e);
            try {
                d['recognize'](value, 'chi_sim', {})['then'](q => {
                    var r = q?.['data']?.['text']['replace'](/\s/g, '');
                    if (r) {
                        console['log']('【识别结果】', r);
                        div_set['parent']()['show']();
                        div_set['show']();
                        find_input['value'] = r;
                    } else {
                        msg_box = document['createElement']('div');
                        msg_box['innerHTML'] = '<p>未识别到文字，如选区中无内容请拖动选区到合适位置</br>并重新框选，如有BUG请QQ频道反馈</p>';
                        c['appendChild'](msg_box);
                    }
                })['catch'](q => {
                    console['error']('【错误】', q);
                });
            } catch {
                c['innerHTML'] = '<p>识别工具暂未加载完毕,请稍等</p>';
            }
        };
        document['addEventListener']('mousemove', h);
        document['addEventListener']('mouseup', i);
    };
    function f() {
        const g = document['body'];
        var h = {
            'useCORS': !![],
            'scrollY':0,
            'scrollX':0
        };
        html2canvas(g, h)['then'](i => {
            b = i;
        });
    }
}());