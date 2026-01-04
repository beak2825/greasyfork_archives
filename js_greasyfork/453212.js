// ==UserScript==
// @name         FaviconBadger
// @description  Add a counter badge on the favicon
// @version      1.0
// @author       ??
// ==/UserScript==

/**
 * Create new FaviconBadger instance
 * @param {Object} [Options]
 * @param {Object} [Options.size=0.6] - Badge's size
 * @param {Object} [Options.position='ne'] - Badge's position ['n' 's' 'e' 'w' 'nw' 'ne' 'sw' 'se']
 * @param {Object} [Options.radius=8] - Badge's border radius
 * @param {Object} [Options.backgroundColor='#f00'] - Badge's background color
 * @param {Object} [Options.color='#fff'] - Badge's text color
 * @return {Object} FaviconBadger object
 * @example
 * const faviconBadger = new FaviconBadger({
 *    size : 0.6,
 *    position : 'ne',
 *    radius : 8,
 *    backgroundColor : '#f00',
 *    color : '#fff'
 * });
 * faviconBadger.value = 1;
 * faviconBadger.update(); 
 */
const FaviconBadger = (function () {
  function FaviconBadger(options) {
    const _this = this;
    this.backgroundColor = options.backgroundColor || '#f00';
    this.color = options.color || '#fff';
    this.size = options.size || 0.6;
    this.position = options.position || 'ne';
    this.radius = options.radius || 8;
    // this.src = options.src || '';
    this.canvas = document.createElement('canvas');
    var _a;
    this.src = (_a = document.querySelector('link[rel$=icon]')) === null || _a === void 0 ? void 0 : _a.href;
    this.ctx = this.canvas.getContext('2d');
    this.faviconSize = 0;
    this.offset = { x: 0, y: 0 };
    this.badgeSize = 0;
    this.value = 0;
    this.img = new Image();
    this.img.addEventListener('load', function () {
      _this.faviconSize = _this.img.naturalWidth;
      _this.badgeSize = _this.faviconSize * _this.size;
      _this.canvas.width = _this.faviconSize;
      _this.canvas.height = _this.faviconSize;
      const sd = _this.faviconSize - _this.badgeSize;
      const sd2 = sd / 2;
      _this.offset = {
        n: { x: sd2, y: 0 },
        e: { x: sd, y: sd2 },
        s: { x: sd2, y: sd },
        w: { x: 0, y: sd2 },
        nw: { x: 0, y: 0 },
        ne: { x: sd, y: 0 },
        sw: { x: 0, y: sd },
        se: { x: sd, y: sd }
      }[_this.position] || { x: 0, y: 0 };
      _this._draw();
    });
    this.img.crossOrigin = 'Anonymous';
    this.img.src = this.src;
  }
  FaviconBadger.prototype._drawIcon = function () {
    this.ctx.clearRect(0, 0, this.faviconSize, this.faviconSize);
    if (this.value)
      this.ctx.drawImage(this.img, 0, 0 + this.faviconSize * 0.2, this.faviconSize * 0.8, this.faviconSize * 0.8);
    else
      this.ctx.drawImage(this.img, 0, 0, this.faviconSize, this.faviconSize);
  };
  FaviconBadger.prototype._drawShape = function () {
    const r = this.radius;
    const xa = this.offset.x;
    const ya = this.offset.y;
    const xb = this.offset.x + this.badgeSize;
    const yb = this.offset.y + this.badgeSize;
    this.ctx.beginPath();
    this.ctx.moveTo(xb - r, ya);
    this.ctx.quadraticCurveTo(xb, ya, xb, ya + r);
    this.ctx.lineTo(xb, yb - r);
    this.ctx.quadraticCurveTo(xb, yb, xb - r, yb);
    this.ctx.lineTo(xa + r, yb);
    this.ctx.quadraticCurveTo(xa, yb, xa, yb - r);
    this.ctx.lineTo(xa, ya + r);
    this.ctx.quadraticCurveTo(xa, ya, xa + r, ya);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fill();
    this.ctx.closePath();

    const margin = (this.badgeSize * 0.18) / 2;
    this.ctx.beginPath();
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.font = 'bold '.concat(this.badgeSize * 0.9, 'px Arial');
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.value.toString(), this.badgeSize / 2 + this.offset.x, this.badgeSize / 2 + this.offset.y + margin);
    this.ctx.closePath();
  };
  FaviconBadger.prototype._drawFavicon = function () {
    document.querySelectorAll('link[rel*=\'icon\']').forEach(elm => {
      elm.parentElement.removeChild(elm);
    });
    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = this.canvas.toDataURL();
    document.querySelector('head').appendChild(link);
  };
  FaviconBadger.prototype._draw = function () {
    this._drawIcon();
    if (this.value)
      this._drawShape();
    this._drawFavicon();
  };
  FaviconBadger.prototype.update = function () {
    this.value = Math.min(99, parseInt(this.value.toString(), 10));
    this._draw();
  };
  return FaviconBadger;
}());
