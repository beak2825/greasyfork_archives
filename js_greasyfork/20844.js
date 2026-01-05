function Logger () {
    this.container = document.createElement('div');

    this.container.style.cssText = [
        'display: flex',
        'flex-flow: column-reverse nowrap',
        'position: fixed',
        'left: 2em',
        'bottom: 2em',
        'margin-top: 5px'
    ].join(';');
    document.body.appendChild(this.container);
}

Logger.prototype.createLogItem = function () {
    var el = document.createElement('div');

    el.style.minWidth = '20em';
    el.style.padding = '1em 2em';
    el.style.borderRadius = '9px';
    el.style.marginBottom = '60px';
    el.style.marginTop = '10px';
    el.style.opacity = 0;
    el.style.transition = 'margin-bottom 1s, opacity .7s, margin-left .5s';

    setTimeout(function () {
        el.style.opacity = 1;
        el.style.marginBottom = '0px';
    }, 20);
    return el;
};

Logger.prototype.stick = function (text) {
    var el = this.createLogItem();
    el.style.backgroundColor = '#5cb75c';

    var textBlock = document.createTextNode(text);
    el.appendChild(textBlock);
    this.container.appendChild(el);

    return el;
};

Logger.prototype.show = function (text) {
    var el = this.stick(text);
    setTimeout(function (self) {
        self.remove(el);
    }, 5000, this);
};

Logger.prototype.remove = function (el) {
    el.style.marginLeft = '-60px';
    el.style.opacity = 0;
    setTimeout(function () {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }, 700);
};
