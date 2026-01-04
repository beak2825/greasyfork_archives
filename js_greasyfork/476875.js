; (function () {

    window.caasHelper = {
        inited: false,
        init: function () {
            let _this = this
            if (_this.inited) return
            _this.inited = true

            _this.load();

            window.addEventListener('popstate', function (event) {
                _this.load();
            });
        },
        url: '',
        urlInfo: null,
        load: function () {
            if (this.url === window.location.href) return;

            this.url = window.location.href
            this.urlInfo = sinHelper.Url.info(this.url)

            let _callback = this.mapper[this.urlInfo.pathname] || null
            if (!_callback) {
                this.removeNode()
                return;
            }

            this.render(true)

            let _obj = _callback()

            if (typeof _obj === "object" && _obj !== null) {
                if (!_obj.hasOwnProperty('no_xhr') || !_obj['no_xhr']) {
                    sinHelper.Xhr.init()
                }

                if (_obj.hasOwnProperty('init')) {
                    _obj.init()
                }
            }
        },
        mapper: {},
        push: function (_key, _callback) {
            this.mapper[_key] = _callback;
        },

        rendered: false,
        nodeId: '',
        headerClass: '',
        contentClass: '',
        buttonClass: '',
        randStr: function () {
            let _r = '';
            while (_r.length <= 0) { _r = Math.random().toString(36).slice(-8); }
            return _r;
        },
        initNodeSelector: function () {
            this.nodeId = 'caas_helper_container_1uFoY';
            if (!this.contentClass) {
                this.contentClass = 'caas_helper_content_' + this.randStr()
            }
            if (!this.headerClass) {
                this.headerClass = 'caas_helper_header_' + this.randStr()
            }
            if (!this.buttonClass) {
                this.buttonClass = 'caas_helper_button' + this.randStr()
            }
        },
        render: function (_force) {
            let _this = this
            if (_force) {
                this.rendered = false;
                this.removeNode()
            }

            if (this.rendered) return
            this.rendered = true;
            this.initNodeSelector()

            let style = `#${_this.nodeId}{position:fixed;right:16px;top:250px;display:inline-block;background:green;color:#fff;font-size:14px;line-height:30px;text-align:center;min-width:74px;min-height:30px;border-radius:16px;z-index:999999;}` +
                `#${_this.nodeId} .${_this.headerClass}{font-size:18px;font-weight:bold;cursor:pointer;user-select:none;padding:5px 16px;}` +
                `#${_this.nodeId} .${_this.contentClass}{text-align:left;max-height:501px;overflow-y:scroll;padding:0px 16px;scrollbar-width: none;-ms-overflow-style: none;}` +
                `#${_this.nodeId} .${_this.contentClass}::-webkit-scrollbar{display: none;}` +
                `#${_this.nodeId} .${_this.buttonClass}{cursor:pointer;user-select:none;width:100%; padding:5px 0px;text-align:center}` +
                '';

            var _stylenode = document.createElement('style');
            _stylenode.setAttribute("type", "text/css");
            if (_stylenode.styleSheet) {// IE
                _stylenode.styleSheet.cssText = style;
            } else {// w3c
                var cssText = document.createTextNode(style);
                _stylenode.appendChild(cssText);
            }
            _stylenode.id = _this.nodeId + '_style'

            var html = '' +
                '    <div class="' + _this.headerClass + '">\n' + '卡思助手' + '    </div>\n' +
                '    <div class="' + _this.contentClass + '">\n' + '' + '</div>\n' +
                '';

            let _boxnode = document.createElement("div")
            _boxnode.id = _this.nodeId;
            _boxnode.innerHTML = html;

            document.getElementsByTagName("body")[0].appendChild(_boxnode);
            document.body.appendChild(_stylenode);

            this.getNodeHeader().onclick = function () {
                let _c = _this.getNodeContent()
                if (_c.style.display == 'none') {
                    _this.showContent();
                } else {
                    _this.hideContent();
                }
            }
            this.clearContent()
        },
        getNode: function () {
            return document.getElementById(this.nodeId)
        },
        getNodeHeader: function () {
            return this.getNode().getElementsByClassName(this.headerClass)[0];
        },
        getNodeContent: function () {
            return this.getNode().getElementsByClassName(this.contentClass)[0];
        },
        removeNode: function () {
            try {
                document.getElementById(this.nodeId).remove()
            } catch (e) { }
            try {
                document.getElementById(this.nodeId + '_style').remove()
            } catch (e) { }
        },
        clearContent: function () {
            this.setContent('')
        },
        hideContent: function () {
            this.getNodeContent().style.display = 'none';
        },
        showContent: function () {
            this.getNodeContent().style.display = '';
        },
        setContent: function (_src) {
            let _object = {};
            if (typeof _src === "object" && _src !== null) {
                _object = this.buildContent(_src)
            } else {
                _object = { 'html': _src }
            }
            if (!_object['html'] || _object['html'].length <= 0) this.hideContent()

            this.getNodeContent().innerHTML = _object['html'];

            (_object['callback'] || []).forEach(_func => {
                _func()
            })

            this.showContent()
        },
        /* {"aaa": {title:'', html: '', callback: func, options:{}}, 'bbb': {}} */
        buildContent: function (_object) {
            let _html = "", _funcs = []
            for (let _k in _object) {
                let _obj = _object[_k]
                if (!_obj['html']) continue;

                let _boxClass = `${this.contentClass}_item_box`, _titleClass = `${this.contentClass}_item_title`,
                    _htmlClass = `${this.contentClass}_item_html`
                let _boxId = `${_boxClass}_${_k}`, _titleId = `${_titleClass}_${_k}`, _htmlId = `${_htmlClass}_${_k}`

                _html += `<div class="${_boxClass}" id="${_boxId}">\n`
                if (_obj['title']) _html += `<div class="${_titleClass}" id="${_titleId}">${_obj['title']}</div>\n`
                _html += `<div class="${_htmlClass}" id="${_htmlId}">\n`
                _html += _obj['html'] + '\n'
                _html += `</div>\n</div>\n`

                if (_obj['callback']) {
                    if (typeof (_obj['callback']) == 'function') {
                        _funcs.push(_obj['callback'])
                    }
                    if (Object.prototype.toString.call(_obj['callback']) === '[object Array]') {
                        _obj['callback'].forEach(_call => {
                            if (typeof (_call) == 'function') {
                                _funcs.push(_call)
                            }
                        })
                    }
                }
                if (_obj['options'] && _obj['options']['hide_item']) {
                    _funcs.push(function () {
                        let _domTitle = document.getElementById(_titleId), _domHtml = document.getElementById(_htmlId)
                        _domTitle.innerHTML = '点击查看 - ' + _obj['title']
                        _domTitle.style.cursor = 'pointer'
                        _domHtml.style.display = 'none'
                        _domTitle.onclick = function (_e) {
                            if (_domHtml.style.display == 'none') {
                                _domHtml.style.display = ''
                                _domTitle.innerHTML = '点击收起 - ' + _obj['title']
                            } else {
                                _domHtml.style.display = 'none'
                                _domTitle.innerHTML = '点击查看 - ' + _obj['title']
                            }
                        }
                    })
                }
            }
            return {
                'html': _html,
                'callback': _funcs,
            }
        },
        buildButton: function (_text) {
            let btnId = this.nodeId + '_btn_' + new Date().getTime() + (function () { let _r = ''; while (_r.length <= 0) { _r = Math.random().toString(36).slice(-8); } return _r; }());
            let btnHtml = '<div id="' + btnId + '" class="' + this.buttonClass + '">' + _text + '</div>'
            return { btnId, btnHtml }
        },
        bindButtonEvent: function (_id, _function, _event) {
            if (!_event) _event = 'click'
            if (_event === 'click') {
                document.getElementById(_id).onclick = _function
            }
        },
    };

})();