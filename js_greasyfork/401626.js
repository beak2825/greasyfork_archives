// ==UserScript==
// @version      2.0
// @license      MIT
// ==/UserScript==

/* **************

  Notify Library
  Developed by pizidavi

  Options:
    - text    required
    - type    optional
      - success
      - info/information
      - warn/warning
      - error
    - timeout	optional (default: 5s)

************** */

var Notify = function Notify(options) {
  var _this = this;
  
  const CSS = '#notify { position: fixed; top: 0; right: 0; z-index: 9999; } #notify > div { display: none; position: relative; width: 300px; padding: .5em .8em; margin: 1em 1em 0 0; border-radius: 2px; background-color: white; color: #2c3e50; font-size: 17px; cursor: pointer; transition: .4s ease-in; }';
  const TYPES = {
	  'success': '#2ecc71',
	  'info': '#3498db',
	  'information': '#3498db',
	  'warn': '#f9ca24',
	  'warning': '#f9ca24',
	  'error': '#e74c3c',
  };

  if (!document.querySelectorAll('#notify').length) {
	const style = document.createElement('style');
    style.innerText = CSS;
	const div = document.createElement('div');
	div.id = 'notify';
	div.append(style);

    document.querySelector('body').append(div);
  }
  
  const template = document.createElement('div');
  template.append(document.createElement('span'))

  _this.options = options;
  _this.container = document.querySelector('#notify');
  _this.template = template;

  if (!_this.options || typeof _this.options != 'object') {
    throw 'Options required';
  }
  if (!_this.options.text) {
    throw 'Options TEXT must not be empty';
  }

  if (_this.options.type) {
    const background = TYPES[_this.options.type];
    if (background) {
      _this.template.style.backgroundColor = background;
      _this.template.style.color = 'white';
    } else {
	  throw 'Type not found';
	}
  }

  _this.id = 'noty_' + Math.random().toString(36).substring(2);
  _this.template.setAttribute('id', _this.id);
  _this.template.querySelector('span').textContent = _this.options.text;
  _this.template.style.right = '-110%';
  _this.template.addEventListener('click', function() {
	_this.close();
  });

};

Notify.prototype.show = function () {
  var _this = this;

  if (!_this.container.querySelector('#'+_this.id)) {
    _this.container.prepend(_this.template); }

  _this.template.style.display = 'block';
  setTimeout(function() {
    _this.template.style.right = '0';
  }, 50);

  if (_this.options.timeout !== false) {
	clearTimeout(_this.closeTime);
    _this.closeTime = setTimeout(function() {
      _this.close();
    }, (_this.options.timeout || 5000));
  }

  return _this;
};

Notify.prototype.close = function () {
  var _this = this;

  if (!_this.container.querySelector('#'+_this.id)) return;

  clearTimeout(_this.closeTime);
  _this.template.style.right = '-110%';

  setTimeout(function() {
    _this.template.remove();
  }, 450);

  return _this;
};
