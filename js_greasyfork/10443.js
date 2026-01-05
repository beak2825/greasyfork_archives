function DataCache(key) {
  this._key = key;
  this._data = {};
  this.load();
}
 
DataCache.prototype = {
  getValue: function(k) {
    return this._data[k];
  },
  setValue: function(k, v) {
    this._data[k] = v;
    this.save();
  },
  deleteValue: function(k) {
    if (k in this._data) {
      delete this._data[k];
      this.save();
    }
  },
  hasValue: function(k) {
    return k in this._data;
  },
  listValues: function() {
    return Object.keys(this._data).sort();
  },
  clear: function() {
    this._data = {};
    this.save();
  },
  save: function() {
    var s = JSON.stringify(this._data);
    GM_setValue(this._key, s);
    console.info('Cache(' + this._key + ') saved: ' + s);
  },
  load: function(s) {
    try {
      this._data = JSON.parse(s || GM_getValue(this._key));
    }
    catch (ex) {
      this.clear();
    }
  },
  edit: function() {
    var res = window.prompt('Edit cached package URLs', JSON.stringify(this._data, null, 2));
    if (res !== null) {
      try {
        this._data = res ? JSON.parse(res) : {};
        this.save();
      }
      catch (ex) {
        console.warn('Failed to update cache data: %s %o', ex.toString(), ex);
      }
    }
  },
  toString: function() {
    return 'Cache(' + this._key + '): [' + this.listValues.join('\n') + ']';
  },
  dump: function() {
    console.log('Cache(' + this._key + '):\n' + JSON.stringify(this._data, null, 2));
  }
};
