// ==UserScript==
// @name        hwm_build_manager
// @author      Chie (http://www.heroeswm.ru/pl_info.php?id=645888)
// @icon        https://s.gravatar.com/avatar/5fd0059ad34d082dfbd50cfdeb9aab6a
// @description Менеджер билдов для HWM
// @namespace   https://github.com/betula/hwm_build_manager
// @homepageURL https://github.com/betula/hwm_build_manager
// @include     http://*heroeswm.ru/*
// @include     http://178.248.235.15/*
// @include     http://*lordswm.com/*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30768/hwm_build_manager.user.js
// @updateURL https://update.greasyfork.org/scripts/30768/hwm_build_manager.meta.js
// ==/UserScript==


// Build Manager 1.0.2

class ServiceContainer {
  
  constructor() {
    this.instances = {};
  }
  
  _service(ctor) {
    let { name } = ctor;
    if (!this.instances[name]) {
      this.instances[name] = new ctor(this);
    }
    return this.instances[name];
  }
  
  get manager() { return this._service(ManagerService) }
  get fraction() { return this._service(FractionService) }
  get inventory() { return this._service(InventoryService) }
  get attribute() { return this._service(AttributeService) }
  get army() { return this._service(ArmyService) }
  get skill() { return this._service(SkillService) }
  get current() { return this._service(CurrentService) }
  get change() { return this._service(ChangeService) }
  get import() { return this._service(ImportService) }
  
}

class ManagerService {
  
  constructor(services) {
    this.services = services;
    this._storage = new LocalStorageArrayDriver('BM_MANAGER');
    this.items = [];
    
    this._restore();
  }
  
  createNew() {
    let nextNumber = 1;
    for (let item of this.items) {
      let match = item.name.match(/^Новый билд (\d+)$/);
      if (match) {
        nextNumber = Math.max(nextNumber, (parseInt(match[1]) || 0) + 1);
      }
    }

    let item = {
      id: uniqid(),
      name: `Новый билд ${nextNumber}`,
      fraction: this.services.fraction.default.id,
      inventory: this.services.inventory.default.id,
      attribute: this.services.attribute.default,
      army: this.services.army.default,
      skill: this.services.skill.default
    }

    this.items.push(item);
    this._store();

    return item;
  }
  
  remove(item) {
    let { founded, index } = this._searchByItem(item);
    if (!founded) return null;
    
    let items = this.items;
    items = items.slice(0, index).concat( items.slice(index + 1) );
    this.items = items;
    this._store();
    
    if (index === items.length) {
      return items[index - 1]
    }
    return items[index];
  }
  
  duplicate(item) {
    let { founded } = this._searchByItem(item);
    if (!founded) return null;

    let duplicate = deepCopy(item);
    duplicate.id = uniqid();
    duplicate.name += ' копия';
    
    this.items.push(duplicate);
    this._store()
    
    return duplicate;
  }
  
  update(updatedItem) {
    let { founded, index } = this._searchById(updatedItem.id);
    if (!founded) return null;

    this.items[index] = updatedItem;
    this._store();
    
    this.services.current.mayBeOnlyNameUpdated(updatedItem);

    return updatedItem;
  }
  
  searchEquals(item) {
    let { founded, index } = this._searchById(item.id);
    if (founded) {
      if (deepEquals(item, this.items[index])) {
        return {
          founded,
          index
        }
      }
    }
    return {
      founded: false
    }
  }

  serialize() {
    return JSON.stringify(this.items);
  }


  unserialize(value) {
    const INVALID = 'invalid';

    const Checker = {
      string(value) {
        if (typeof value !== 'string' || value.length === 0) throw INVALID;
      },
      number(value) {
        if (typeof value !== 'number') throw INVALID;
      },
      array(value) {
        if (!Array.isArray(value)) throw INVALID;
      },
      object(value) {
        if (!value || typeof value !== 'object') throw INVALID;
      },
      keys(value, keys) {
        if (!keys.every({}.hasOwnProperty.bind(value))) throw INVALID;
        for (let key of Object.keys(value)) {
          Checker.enum(key, keys);
        }
      },
      enum(value, values) {
        if (Array.isArray(value)) {
          for (let once of value) {
            Checker.enum(once, values);
          }
        } else {
          if (Array.isArray(values)) {
            if (values.indexOf(value) === -1) throw INVALID;
          } else {
            if (!values.hasOwnProperty(value)) throw INVALID;
          }
        }
      },
      length(value, len) {
        if (value.length !== len) throw INVALID;
      }

    };

    let items = [];

    try {
      items = JSON.parse(value);
      Checker.array(items);

      for (let item of items) {
        Checker.object(item);
        Checker.keys(item, [ 'id', 'name', 'fraction', 'inventory', 'attribute', 'army', 'skill' ]);

        let { id, name, fraction, inventory, attribute, army, skill } = item;

        Checker.string(id);
        Checker.string(name);
        Checker.enum(fraction, this.services.fraction.map);
        Checker.enum(inventory, this.services.inventory.map);

        Checker.object(attribute);
        Checker.keys(attribute, this.services.attribute.list);
        Object.values(attribute).forEach(Checker.number);

        Checker.array(army);
        Checker.length(army, 7);
        army.forEach(Checker.number);

        Checker.array(skill);
        Checker.enum(skill, this.services.skill.map);
      }

    } catch(e) {
      return false;
    }

    this.items = items;
    this._store();
    return true;
  }
  
  _searchById(id) {
    const items = this.items;
    let founded = false;   
    let index;
    for (index = 0; index < items.length; index++) {
      if (items[index].id === id) {
        founded = true;
        break;
      }
    }
    return founded ? { founded, index } : { founded: false };
  }
  
  _searchByItem(item) {
    let index = this.items.indexOf(item);
    return index != -1 
      ? { founded: true, index } 
      : { founded: false };
  }
  
  _restore() {
    this.items = this._storage.fetch();
  }
  
  _store() {
    this._storage.put(this.items);
  }
  
}

class CurrentService {

  constructor(services) {
    this.services = services;
    this._storage = new LocalStorageDriver('BM_CURRENT');
    this._restore();
  }

  get item() {
    return this._item;
  }

  mayBeOnlyNameUpdated(updatedItem) {
    let current = this._item;
    
    if (!current) return;
    if (current.id !== updatedItem.id) return;
    
    let clone = deepCopy(current);
    clone.name = updatedItem.name;
    if (!deepEquals(clone, updatedItem)) return;
    
    current.name = updatedItem.name;
    this._store();
  }
  
  isExpired() {
    if (!this._item) return false;
    return !this.services.manager.searchEquals(this._item).founded;
  }

  change(item, force) {
    item = deepCopy(item);

    const change = () => {
      if (!item) return item;
      if (force || !this._item) {
        return this.services.change.force(item);
      }
      return this.services.change.diff(this._item, item);
    };

    return this.changeQueue = (this.changeQueue || Promise.resolve())
      .then(change, change)
      .then((item) => {
        this._update(item);
        return item;
      }, (e) => {
        this._update();
        return Promise.reject(e);
      });
  }
  
  equals(item) {
    return deepEquals(this._item, item);
  }
  
  _update(item = null) {
    this._item = item;
    this._store();
  }
  
  _restore() {
    this._item = this._storage.fetch();
  }
  
  _store() {
    this._storage.put(this._item);
  }

}

class ChangeService {

  constructor(services) {
    this.services = services;
    this.cache = {};
  }

  force(to) {
    const promise = Promise.resolve()
      .then(() => this._fraction(to.fraction))
      .then(() => this._skill(to.skill))
      .then(() => this._army(to.army))
      .then(() => this._inventory(to.inventory))
      .then(() => this._reset())
      .then(() => this._attribute(to.attribute))
      .then(() => to);
      
    return PromiseMDecorator(promise);
  }

  diff(from, to) {    
    const fractionChanged = from.fraction !== to.fraction;
    const skillChanged = fractionChanged || !deepEquals(from.skill, to.skill);
    const armyChanged = fractionChanged || !deepEquals(from.army, to.army);
    const inventoryChanged = from.inventory !== to.inventory;
    const attributeChanged = !deepEquals(from.attribute, to.attribute);

    let serial = Promise.resolve();
    if (fractionChanged) {
      serial = serial.then(() => this._fraction(to.fraction, from.fraction))
    }
    if (skillChanged) {
      serial = serial.then(() => this._skill(to.skill))
    }
    if (armyChanged) {
      serial = serial.then(() => this._army(to.army))
    }
    if (inventoryChanged) {
      serial = serial.then(() => this._inventory(to.inventory))
    }
    if (attributeChanged) {
      serial = serial
        .then(() => this._reset())
        .then(() => this._attribute(to.attribute))
    }
    serial = serial.then(() => to);
    
    return PromiseMDecorator(serial);
  }

  _fraction(to, from) {
    to = this.services.fraction.map[to];
    
    let prepare = Promise.resolve();

    if (from) {
      from = this.services.fraction.map[from];
    } else {
      prepare = this.services.import.getFraction().then((id) => {
        from = this.services.fraction.map[id];
      })
    }

    const change = (data) => {
      return httpPlainRequest('FORM', '/castle.php', data)
    }

    return prepare.then(() => {

      if (from.fract !== to.fract) {
        let promise = change({ fract: to.fract });
        if (to.classid !== '0') {
          return promise.then(() => {
            return change({ classid: to.classid })
          });
        }
        return promise
      }

      if (from.classid !== to.classid) {
        return change({ classid: to.classid })
      }

    })
  }

  _skill(list) {
    let data = {
      rand: Math.random(),
      setstats: 1,
    }

    for (let i = 0; i < list.length; i++) {
      data[`param${i}`] = list[i];
    }

    return httpPlainRequest('FORM', '/skillwheel.php', data);
  }

  _army(list) {
    let data = {
      rand: Math.random(),
    }

    for (let i = 0; i < list.length; i++) {
      data[`countv${i+1}`] = list[i];
    }

    return httpPlainRequest('FORM', '/army_apply.php', data);
  }

  _inventory(id) {
    let struct = this.services.inventory.map[id];
    let data = {
      r: Date.now() + String(Math.random()).slice(2)
    };
    data[struct.type] = struct.value;
    return httpPlainRequest('GET', '/inventory.php', data);
  }

  _reset() {
    let resetLinkPromise = Promise.resolve(this.cache.resetLink);

    if (!this.cache.resetLink) {
      resetLinkPromise = httpPlainRequest('GET', '/home.php').then((html) => {
        let m = html.match(/shop\.php\?b=reset_tube&reset=2&sign=[0-9a-f]+/);
        if (!m) return null;
        return this.cache.resetLink = '/' + m[0];
      })
    }

    return resetLinkPromise.then((url) => (url ? httpPlainRequest('GET', url) : null));
  }

  _attribute(obj) {
    const getTotal = () => {
      return httpPlainRequest('GET', '/home.php').then((html) => {
        let m = html.match(/href="home\.php\?increase_all=knowledge"(?:.|\n)*?(\d+)\<\/td/);
        if (!m) return null;
        return parseInt(m[1]) || null;
      });
    }

    const increase = (name, count) => {
      let serial = Promise.resolve();
      for (let i = 0; i < count; i++) {
        serial = serial.then(() => httpPlainRequest('GET', `/home.php?increase=${name}`));
      }
      return serial;
    }

    const increaseAll = (name) => {
      return httpPlainRequest('GET', `/home.php?increase_all=${name}`);
    }

    const distribute = (total) => {
      total = total || 0;

      let list = [];
      for (let name of Object.keys(obj)) {
        list.push({ name, value: obj[name] })
      }
      list.sort((a, b) => a.value - b.value);

      let serial = Promise.resolve();

      let used = 0;
      list.slice(0, -1).forEach(({ name, value }) => {
        if (used >= total) return;
        if (value === 0) return;

        let v = Math.min(total - used, value);
        used += value;
        serial = serial.then(() => increase(name, v));
      });

      if (total > used) {
        let { name, value } = list[ list.length - 1 ];
        if (value > 0) {
          if (value < total - used) {
            serial = serial.then(() => increase(name, value)); 
          } else {
            serial = serial.then(() => increaseAll(name));
          } 
        }       
      }

      return serial;      
    }

    return getTotal().then(distribute);
  }

}

class ImportService {

  constructor(services) {
    this.services = services;
  }

  getInventoryNamesIfAvailable() {
    if (location.pathname.match(/^\/inventory\.php/)) {
      let list = [];
      let nodes = document.querySelectorAll('a[href*="inventory.php?all_on"]');
      for (let node of nodes) {
        let [ _, type, value ] = node.getAttribute('href').match(/(all_on)=(\d)/);
        let name = node.innerText;
        list.push({
          type,
          value,
          name
        });
      }
      return list;
    }
  }

  getArmy() {
    return httpPlainRequest('GET', '/army.php').then((html) => {
      let m = html.match(/\<param name="FlashVars" value="param=\d+\|M([^"]+)/);
      if (!m) return null;
      
      let chunks = m[1].split(';M');
      let items = [];

      for (let chunk of chunks) {
        items.push( parseInt(chunk.split(':')[1].substr(57,3)) || 0 );
      }

      for (let i = items.length; i < this.services.army.iterator.length; i++) {
        items.push(0);
      }

      return items;
    });
  }

  getFraction() {
    return httpPlainRequest('GET', '/castle.php').then((html) => {
      let dict = {};
      for (let { fract, classid } of this.services.fraction.list) {
        if (!dict[fract]) {
          dict[fract] = {};
        }
        dict[fract][classid] = true;
      }

      const extractFract = () => {
        let m = html.match(/\<select name='fract'((?:.|[\r\n])+?)\<\/select/);
        if (!m) return null;

        let available = {};
        m[1].replace(/value=(\d)/g, (_, id) => {
          available[id] = true;
        });

        for (let id of Object.keys(dict)) {
          if (!available[id]) return id;
        }
      }

      const extractClassid = (fract) => {
        let m = html.match(/\<select name='classid'((?:.|[\r\n])+?)\<\/select/);
        if (!m) return null;

        let available = {};
        m[1].replace(/value=(\d)/g, (_, id) => {
          available[id] = true;
        });

        for (let id of Object.keys(dict[fract])) {
          if (!available[id]) return id;
        }
      }

      let fract = extractFract();
      if (!fract) return null;

      let classidList = Object.keys(dict[fract]);
      let classid;

      if (classidList.length === 1) {
        classid = classidList[0];

      } else {
        classid = extractClassid(fract);
        if (!classid) return null;
      }

      return `${fract}${classid}`
    })
  }

  getSkill() {
    return httpPlainRequest('GET', '/skillwheel.php').then((html) => {
      let m = html.match(/\<param name="FlashVars" value='param=.+?;builds=([^']+)/);
      if (!m) return null;
      
      let rows = m[1].split('$');
      let items = [];

      for (let r of rows) {
        let row = r.split('|');
        if (row.length != 10) continue;

        let id = row[0];
        let has = row[8];

        if (has === '1') {
          items.push(id);
        }
      }

      return items;
    })
  }

}

class FractionService {
  
  constructor() {
    this.list = [
      { fract: '1', classid: '0', name: 'Рыцарь' },
      { fract: '1', classid: '1', name: 'Рыцарь света' },
      { fract: '2', classid: '0', name: 'Некромант' },
      { fract: '2', classid: '1', name: 'Некромант - повелитель смерти' },
      { fract: '3', classid: '0', name: 'Маг' },
      { fract: '3', classid: '1', name: 'Маг-разрушитель' },
      { fract: '4', classid: '0', name: 'Эльф' },
      { fract: '4', classid: '1', name: 'Эльф-заклинатель' },
      { fract: '5', classid: '0', name: 'Варвар' },
      { fract: '5', classid: '1', name: 'Варвар крови' },
      { fract: '5', classid: '2', name: 'Варвар-шаман' },
      { fract: '6', classid: '0', name: 'Темный эльф' },
      { fract: '6', classid: '1', name: 'Темный эльф-укротитель' },
      { fract: '7', classid: '0', name: 'Демон' },
      { fract: '7', classid: '1', name: 'Демон тьмы' },
      { fract: '8', classid: '0', name: 'Гном' },
      { fract: '9', classid: '0', name: 'Степной варвар' }
    ];
    
    this.map = {};
    
    for (let item of this.list) {
      item.id = item.fract + item.classid;
      this.map[item.id] = item;
    }
  }
  
  get default() {
    return this.list[0];
  }
  
}

class InventoryService {
  
  constructor(services) {
    this.services = services;
    this._storage = new LocalStorageArrayDriver('BM_INVENTORY');
    this.loaded = false;
    
    this.list = [
      { type: 'all_off', value: '100', name: 'Снять все' },
      { type: 'all_on', value: '1', name: 'Набор 1' },
      { type: 'all_on', value: '2', name: 'Набор 2' },
      { type: 'all_on', value: '3', name: 'Набор 3' },
      { type: 'all_on', value: '4', name: 'Набор 4' },
      { type: 'all_on', value: '5', name: 'Набор 5' }
    ]
    
    this.map = {};
    
    for (let item of this.list) {
      item.id = item.type + item.value;
      this.map[item.id] = item;
    }
    
    this._restore();
  }
  
  _restore() {
    let list = this._storage.fetch();
    
    for (let item of list) {
      let id = item.type + item.value;
      if (this.map[id]) {
        this.map[id].name = item.name;
      }
    }
  }
  
  syncNamesIfAvailable() {
    let list = this.services.import.getInventoryNamesIfAvailable();
    if (list) {
      for (let { type, value, name } of list) {
        let id = type + value;
        if (this.map[id]) {
          this.map[id].name = name;
        }    
      }
      this._storage.put(list);
    }
  }
  
  get default() {
    return this.list[0];
  }
  
}

class AttributeService {
  
  get list() {
    return Object.keys(this.default);
  }
  
  get default() {
    return {
      attack: 0,
      defence: 0,
      power: 0,
      knowledge: 0
    }
  }
  
}

class ArmyService {
  
  get iterator() {
    return this.default;
  }
  
  get default() {
    return [ 0, 0, 0, 0, 0, 0, 0 ]
  }
  
}



class SkillService {
  
  constructor() {
    this.table = [
      { id: "attack", name: "Нападение", list: [
        { id: "attack1", name: "Основы нападения", main: true },
        { id: "attack2", name: "Развитое нападение", main: true },
        { id: "attack3", name: "Искусное нападение", main: true },
        { id: "battle_frenzy", name: "Боевое безумие" },
        { id: "retribution", name: "Воздаяние" },
        { id: "nature_wrath", name: "Лесная ярость" },
        { id: "power_of_speed", name: "Мастерство скорости" },
        { id: "excruciating_strike", name: "Мощный удар" },
        { id: "archery", name: "Стрельба" },
        { id: "tactics", name: "Тактика" },
        { id: "cold_steel", name: "Холодная сталь" },
      ]}, { id: "defense", name: "Защита", list: [
        { id: "defense1", name: "Основы защиты", main: true },
        { id: "defense2", name: "Развитая защита", main: true },
        { id: "defense3", name: "Искусная защита", main: true },
        { id: "last_stand", name: "Битва до последнего" },
        { id: "stand_your_ground", name: "Глухая оборона" },
        { id: "preparation", name: "Готовность" },
        { id: "power_of_endurance", name: "Сила камня" },
        { id: "resistance", name: "Сопротивление" },
        { id: "protection", name: "Сопротивление магии" },
        { id: "vitality", name: "Стойкость" },
        { id: "evasion", name: "Уклонение" },
      ]}, { id: "luck", name: "Удача", list: [
        { id: "luck1", name: "Призрачная удача", main: true },
        { id: "luck2", name: "Большая удача", main: true },
        { id: "luck3", name: "Постоянная удача", main: true },
        { id: "magic_resistance", name: "Магическое сопротивление" },
        { id: "piercing_luck", name: "Пронзающая удача" },
        { id: "soldier_luck", name: "Солдатская удача" },
        { id: "warlock_luck", name: "Удачливый чародей" },
        { id: "swarming_gate", name: "Широкие врата ада" },
        { id: "elven_luck", name: "Эльфийская удача" },
      ]}, { id: "leadership", name: "Лидерство", list: [
        { id: "leadership1", name: "Основы лидерства", main: true },
        { id: "leadership2", name: "Развитое лидерство", main: true },
        { id: "leadership3", name: "Искусное лидерство", main: true },
        { id: "aura_of_swiftness", name: "Аура скорости" },
        { id: "divine_guidance", name: "Воодушевление" },
        { id: "battle_commander", name: "Лесной лидер" },
        { id: "recruitment", name: "Сбор войск" },
        { id: "empathy", name: "Сопереживание" },
      ]}, { id: "enlightenment", name: "Образование", list: [
        { id: "enlightenment1", name: "Начальное образование", main: true },
        { id: "enlightenment2", name: "Среднее образование", main: true },
        { id: "enlightenment3", name: "Высшее образование", main: true },
        { id: "graduate", name: "Выпускник" },
        { id: "wizard_reward", name: "Колдовская награда" },
        { id: "know_your_enemy", name: "Лесное коварство" },
        { id: "lord_of_the_undead", name: "Повелитель мёртвых" },
        { id: "intelligence", name: "Притяжение маны" },
        { id: "dark_revelation", name: "Тёмное откровение" },
        { id: "arcane_exaltation", name: "Хранитель тайного" },
      ]}, { id: "dark", name: "Магия Тьмы", list: [
        { id: "dark1", name: "Основы магии Тьмы", main: true },
        { id: "dark2", name: "Сильная магия Тьмы", main: true },
        { id: "dark3", name: "Искусная магия Тьмы", main: true },
        { id: "weakening_strike", name: "Ослабляющий удар" },
        { id: "fallen_knight", name: "Падший рыцарь" },
        { id: "master_of_pain", name: "Повелитель боли" },
        { id: "master_of_curses", name: "Повелитель проклятий" },
        { id: "master_of_mind", name: "Повелитель разума" },
      ]}, { id: "destructive", name: "Магия Хаоса", list: [
        { id: "destructive1", name: "Основы магии Хаоса", main: true },
        { id: "destructive2", name: "Сильная магия Хаоса", main: true },
        { id: "destructive3", name: "Искусная магия Хаоса", main: true },
        { id: "searing_fires", name: "Иссушающее пламя" },
        { id: "sap_magic", name: "Истощение магии" },
        { id: "fiery_wrath", name: "Огненная ярость" },
        { id: "master_of_storms", name: "Повелитель бурь" },
        { id: "master_of_fire", name: "Повелитель огня" },
        { id: "master_of_ice", name: "Повелитель холода" },
        { id: "secrets_of_destruction", name: "Тайны хаоса" },
      ]}, { id: "light", name: "Магия Света", list: [
        { id: "light1", name: "Основы магии Света", main: true },
        { id: "light2", name: "Сильная магия Света", main: true },
        { id: "light3", name: "Искусная магия Света", main: true },
        { id: "master_of_blessings", name: "Дарующий благословение" },
        { id: "master_of_abjuration", name: "Дарующий защиту" },
        { id: "fire_resistance", name: "Защита от огня" },
        { id: "master_of_wrath", name: "Повелитель ярости" },
        { id: "twilight", name: "Сумерки" },
        { id: "refined_mana", name: "Тайны света" },
      ]}, { id: "summon", name: "Магия Природы", list: [
        { id: "summon1", name: "Основы магии Природы", main: true },
        { id: "summon2", name: "Сильная магия Природы", main: true },
        { id: "summon3", name: "Искусная магия Природы", main: true },
        { id: "master_of_conjuration", name: "Повелитель волшебства" },
        { id: "master_of_life", name: "Повелитель жизни" },
        { id: "master_of_obstacles", name: "Повелитель препятствий" },
      ]}, { id: "sorcery", name: "Чародейство", list: [
        { id: "sorcery1", name: "Основы чародейства", main: true },
        { id: "sorcery2", name: "Развитое чародейство", main: true },
        { id: "sorcery3", name: "Искусное чародейство", main: true },
        { id: "mana_regeneration", name: "Восполнение маны" },
        { id: "boneward", name: "Защита от магии хаоса" },
        { id: "erratic_mana", name: "Изменчивая мана" },
        { id: "magic_insight", name: "Мудрость" },
        { id: "arcane_brillance", name: "Тайное откровение" },
        { id: "arcane_excellence", name: "Тайное преимущество" },
        { id: "arcane_training", name: "Тайные знания" },
      ]}, { id: "special", name: "Фракция", list: [
        { id: "hellfire", name: "Адское пламя" },
        { id: "magic_mirror", name: "Волшебное зеркало" },
        { id: "runeadv", name: "Дополнительные руны" },
        { id: "necr_soul", name: "Духовная связь" },
        { id: "zakarrow", name: "Заколдованная стрела" },
        { id: "nomagicdamage", name: "Контроль магии" },
        { id: "elf_shot", name: "Ливень из стрел" },
        { id: "benediction", name: "Молитва" },
        { id: "knight_mark", name: "Надзор" },
        { id: "memoryblood", name: "Память нашей Крови" },
        { id: "cre_master", name: "Повелитель существ" },
        { id: "consumecorpse", name: "Поглощение трупов" },
        { id: "barb_skill", name: "Пробивающая мощь" },
        { id: "powerraise", name: "Совершенное Поднятие мертвецов" },
        { id: "dark_blood", name: "Тёмная кровь" },
        { id: "dark_power", name: "Тёмная сила" },
        { id: "save_rage", name: "Упорство ярости" },
      ]} 
    ];
    
    this.map = {};
    for (let section of this.table) {
      for (let item of section.list) {
        this.map[item.id] = item;
      }
    }
  }
  
  get default() {
    return [];
  }
  
}


styles(`
.mb-editor-name__box {
  margin: 5px 0 0 0;
}
.mb-editor-name__block-label {
  display: inline-block;
  width: 110px;
}
.mb-editor-name__block-input {
  width: 526px;
}
`);
class EditorNameComponent {
  
  view({ attrs: { value, onchange } }) {

    return m('.mb-editor-name__box', [
      m('.mb-editor-name__block', [
        m('.mb-editor-name__block-label', 'Название:'),
        m('input.mb-editor-name__block-input', { oninput: m.withAttr('value', onchange), value })
      ])
    ])
  }
}


styles(`
.mb-editor-fraction__box {
  margin: 5px 0;
}
.mb-editor-fraction__block-label {
  display: inline-block;
  width: 110px;
}
.mb-editor-fraction__import-button {
  display: inline-block;
  margin-left: 4px;
  cursor: pointer;
}
.mb-editor-fraction__import-button:hover {
  text-decoration: underline;
}
.mb-editor-fraction__import-button--importing {
  animation: mb-fraction-import-animation 1s infinite linear;
  cursor: wait;
}
.mb-editor-fraction__import-button--importing:hover {
  text-decoration: none;
}
@keyframes mb-fraction-import-animation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
}
`);
class EditorFractionComponent {
  
  constructor({ attrs: { services }}) {
    this.services = services;
  }

  view({ attrs: { value, onchange } }) {

    const importAction = () => {
      if (this.importing) return;
      
      this.importing = true;
      
      const finish = () => { this.importing = false };
      
      this.services.import.getFraction()
        .then((val) => {
          if (val) {
            onchange(val);
          }
        })
        .then(finish, finish);
    };

    const importButton = () => {
      return m('.mb-editor-fraction__import-button', { onclick: importAction, class: this.importing ? 'mb-editor-fraction__import-button--importing' : '' }, '<')
    };

    return m('.mb-editor-fraction__box', [
      m('.mb-editor-fraction__block', [
        m('.mb-editor-fraction__block-label', 'Фракция:'),
        m('select', 
          { oninput: m.withAttr('value', onchange), value: value },
          this.services.fraction.list.map(({ id, name }) => {
            return m('option', { key: id, value: id }, name);
          })),
        importButton()
      ])
    ])
  }
}

styles(`
.mb-editor-inventory__box {
  margin: 5px 0;
}
.mb-editor-inventory__block-label {
  display: inline-block;
  width: 110px;
}
`);
class EditorInventoryComponent {
  
  constructor({ attrs: { services }}) {
    this.services = services;
  }

  view({ attrs: { value, onchange } }) {

    return m('.mb-editor-inventory__box', [
      m('.mb-editor-inventory__block', [
        m('.mb-editor-inventory__block-label', 'Набор оружия:'),
        m('select', 
          { oninput: m.withAttr('value', onchange), value: value },
          this.services.inventory.list.map(({ id, name }) => {
            return m('option', { key: id, value: id }, name);
          }))
      ])
    ])
  }
}

styles(`
.mb-editor-attribute__box {
  margin: 5px 0;
}
.mb-editor-attribute__block-label {
  display: inline-block;
  width: 110px;
}
.mb-editor-attribute__block-input {
  width: 20px;
  display: inline-block;
}
`);
class EditorAttributeComponent {
  
  constructor({ attrs: { services }}) {
    this.services = services;
  }
  
  view({ attrs: { value, onchange } }) {
    
    let changeAction = (name, val) => {
      onchange(Object.assign({}, value, { [name]: parseInt(val) || 0 }));
    }
    
    return m('.mb-editor-attribute__box', [
      m('.mb-editor-attribute__block', [
        m('.mb-editor-attribute__block-label', 'Аттрибуты:'),
        this.services.attribute.list.map((name) => {
          return m('input.mb-editor-attribute__block-input', 
            { key: name, oninput: m.withAttr('value', (value) => { changeAction(name, value) }), value: value[name] || 0 });
        })
      ])
    ])
  }
}

styles(`
.mb-editor-army__box {
  margin: 5px 0;
}
.mb-editor-army__block-label {
  display: inline-block;
  width: 110px;
}
.mb-editor-army__block-controls {
  display: inline-block;
}
.mb-editor-army__block-input {
  width: 24px;
  display: inline-block;
}
.mb-editor-army__block-input:nth-child(1), 
.mb-editor-army__block-input:nth-child(2),
.mb-editor-army__block-input:nth-child(3),
.mb-editor-army__block-input:nth-child(4){
  width: 30px;
}
.mb-editor-army__block-import-button {
  margin-left: 4px;
  display: inline-block;
  cursor: pointer;
}
.mb-editor-army__block-import-button:hover {
  text-decoration: underline;
}
.mb-editor-army__block-import-button--importing {
  animation: mb-army-import-animation 1s infinite linear;
  cursor: wait;
}
.mb-editor-army__block-import-button--importing:hover {
  text-decoration: none;
}
@keyframes mb-army-import-animation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
}
`);
class EditorArmyComponent {
  
  constructor({ attrs: { services }}) {
    this.services = services;
  }
  
  view({ attrs: { value, onchange } }) {
    
    const changeAction = (index, val) => {
      let data = value.slice();
      data[index] = parseInt(val) || 0;
      onchange(data);
    };
    
    const importAction = () => {
      if (this.importing) return;
      
      this.importing = true;
      
      const finish = () => { this.importing = false };
      
      this.services.import.getArmy()
        .then((val) => {
          if (val) {
            onchange(val);
          }
        })
        .then(finish, finish);
    };
    
    const importButton = () => {
      return m('.mb-editor-army__block-import-button', { onclick: importAction, class: this.importing ? 'mb-editor-army__block-import-button--importing' : '' }, '<')
    };
    
    return m('.mb-editor-army__box', [
      m('.mb-editor-army__block', [
        m('.mb-editor-army__block-label', 'Армия:'),
        m('.mb-editor-army__block-controls', 
          this.services.army.iterator.map((_, index) => {
            return m('input.mb-editor-army__block-input', 
              { key: index, oninput: m.withAttr('value', (value) => { changeAction(index, value) }), value: value[index] || 0 })
          })
        ),
        importButton()
      ])
    ])
  }
}

styles(`
.mb-editor-skill__box {
  margin: 5px 0;
}
.mb-editor-skill__select {
  display: inline-block;
}
.mb-editor-skill__option--main {
  font-weight: bold;
}
.mb-editor-skill__list-item-name {
  display: inline-block;
  margin-right: 4px;
}
.mb-editor-skill__list-item-button {
  display: inline-block;
  cursor: pointer;
}
.mb-editor-skill__list-item-button:hover {
  text-decoration: underline;
}
.mb-editor-skill__import-button {
  display: inline-block;
  margin-left: 4px;
  cursor: pointer;
}
.mb-editor-skill__import-button:hover {
  text-decoration: underline;
}
.mb-editor-skill__import-button--importing {
  animation: mb-skill-import-animation 1s infinite linear;
  cursor: wait;
}
.mb-editor-skill__import-button--importing:hover {
  text-decoration: none;
}
@keyframes mb-skill-import-animation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
}
`);
class EditorSkillComponent {
  
  constructor({ attrs: { services }}) {
    this.services = services;
  }
  
  view({ attrs: { value, onchange } }) {
    
    const removeAction = (id) => {
      let p = value.indexOf(id);
      onchange(value.slice(0, p).concat( value.slice(p + 1) ));
    };
    
    const importAction = () => {
      if (this.importing) return;
      
      this.importing = true;
      
      const finish = () => { this.importing = false };
      
      this.services.import.getSkill()
        .then((val) => {
          if (val) {
            onchange(val);
          }
        })
        .then(finish, finish);
    };
    
    const importButton = () => {
      return m('.mb-editor-skill__import-button', { onclick: importAction, class: this.importing ? 'mb-editor-skill__import-button--importing' : '' }, '<')
    };
    
    const list = () => {
      return m('.mb-editor-skill__list', value.map((id) => {
        return m('.mb-editor-skill__list-item', [
          m('.mb-editor-skill__list-item-name', this.services.skill.map[id].name),
          m('.mb-editor-skill__list-item-button', { onclick: () => { removeAction(id) } }, '[х]')
        ])
      }))
    }
    
    const select = () => {
      return m('select.mb-editor-skill__select', 
        { oninput: m.withAttr('value', (id) => { onchange(value.concat(id)) }) }, [
          m('option', 'Навыки:'),
          this.services.skill.table.map(({ id, name, list }) => {
            return m('optgroup', { key: id, label: name }, list.map(({ id, name, main }) => {
              if (value.indexOf(id) !== -1) return null;
              return m('option', { key: id, value: id, class: main ? 'mb-editor-skill__option--main': '' }, name)
            }))
          })
        ])
    };
    
    return m('.mb-editor-skill__box', [
      m('.mb-editor-skill__select-block', [
        select(),
        importButton()
      ]),
      list()
    ])
  }
}


styles(`
.mb-editor__section {
  padding: 5px 6px;
  display: table;
}
.mb-editor__buttons {
  padding: 3px 5px 4px 5px;
  border-top: 1px #5D413A solid;
  background: #F5F3EA;
  height: 16px;
}
.mb-editor__save-button {
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  margin-right: 8px;
}
.mb-editor__cancel-button {
  cursor: pointer;
  display: inline-block;
}
.mb-editor__close-button {
  cursor: pointer;
  display: inline-block;
}
.mb-editor__save-button:hover, 
.mb-editor__cancel-button:hover,
.mb-editor__close-button:hover {
  text-decoration: underline;
}
.mb-editor__section-column {
  float: left;
  margin-right: 30px;
}
.mb-editor__section-column:last-child {
  margin-right: 0;
}
`);
class EditorComponent {
  
  constructor({ attrs: { services }}) {
    this.services = services;
  }
  
  _updateOriginItem(item) {
    if (this.originItem !== item) {
      this.originItem = item;
      this.item = deepCopy(item);
    }
  }

  cancel() {
    this.item = deepCopy(this.originItem);
  }
  
  view({ attrs: { item: originItem, onchange, onclose } }) {
    this._updateOriginItem(originItem);

    let item = this.item;
    let services = this.services;
    
    const closeAction = () => {
      onclose();
    }
    
    const buttons = () => {
      let controls;
      if (deepEquals(this.item, originItem)) {
        controls =  m('.mb-editor__close-button', { onclick: closeAction }, 'Закрыть');

      } else {
        controls = [
          m('.mb-editor__save-button', { onclick: () => { onchange(item) }}, 'Сохранить'),
          m('.mb-editor__cancel-button', { onclick: this.cancel.bind(this) }, 'Отменить')
        ];
      }
      return m('.mb-editor__buttons', controls);
    };
    
    
    return m('.mb-editor__box', [
      m('.mb-editor__section', [
        m(EditorNameComponent, { value: item.name, onchange: (value) => { item.name = value } }),
        m('.mb-editor__section-column', [
          m(EditorFractionComponent, { services, value: item.fraction, onchange: (value) => { item.fraction = value } }),
          m(EditorInventoryComponent, { services, value: item.inventory, onchange: (value) => { item.inventory = value } }),
          m(EditorAttributeComponent, { services, value: item.attribute, onchange: (value) => { item.attribute = value } }),
          m(EditorArmyComponent, { services, value: item.army, onchange: (value) => { item.army = value } }),          
        ]),
        m('.mb-editor__section-column', [
          m(EditorSkillComponent, { services, value: item.skill, onchange: (value) => { item.skill = value } }),          
        ])
      ]),
      buttons()
    ])
  }
  
}




styles(`
.mb-export-popup__box {
  position: absolute;
  top: 2px;
  left: 2px;
  border: 1px #5D413A solid;
}
.mb-export-popup__header {
  background: #F5F3EA;
  border-bottom: 1px #5D413A solid;
  text-align: right;
}
.mb-export-popup__close-button {
  display: inline-block;
  cursor: pointer;
  color: rgb(89, 44, 8);
  padding: 4px 6px;
}
.mb-export-popup__close-button:hover {
  text-decoration: underline;
}
.mb-export-popup__body {  
  background: #fff;
}
.mb-export-popup__body textarea {
  resize: none;
  box-sizing: border-box;
  width: 580px;
  height: 300px;
  font-size: 11px;
  padding: 3px 5px;
  margin: 0;
  border: none;
}
.mb-export-popup__footer {
  padding: 3px 5px 4px 5px;
  border-top: 1px #5D413A solid;
  background: #F5F3EA;
  height: 16px;
}
`);
class ExportPopup {
  
  constructor({ attrs: { services }}) {
    this.services = services;
  }

  oncreate({ dom, attrs: { onclose } }) {
    this.releaseClickOutEventListener = nextTickAddClickOutEventListener(dom, onclose);
  }
  
  onbeforeremove() {
    this.releaseClickOutEventListener();
  }

  view({ attrs: { onclose }}) {
    return m('.mb-export-popup__box', [
      m('.mb-export-popup__header', [
        m('.mb-export-popup__close-button', { onclick: onclose }, 'Закрыть')
      ]),
      m('.mb-export-popup__body', [
        m('textarea', { readonly: true, value: this.services.manager.serialize() })
      ]),
      m('.mb-export-popup__footer')
    ])
  }

};

styles(`
.mb-import-popup__box {
  position: absolute;
  top: 2px;
  left: 2px;
  border: 1px #5D413A solid;
}
.mb-import-popup__header {
  background: #F5F3EA;
  border-bottom: 1px #5D413A solid;
  text-align: right;
}
.mb-import-popup__close-button,
.mb-import-popup__import-button {
  display: inline-block;
  cursor: pointer;
  color: rgb(89, 44, 8);
  padding: 4px 6px;
}
.mb-import-popup__close-button:hover,
.mb-import-popup__import-button:hover {
  text-decoration: underline;
}
.mb-import-popup__import-button {
  font-weight: bold;
}
.mb-import-popup__body {  
  background: #fff;
}
.mb-import-popup__body textarea {
  resize: none;
  box-sizing: border-box;
  width: 580px;
  height: 300px;
  font-size: 11px;
  padding: 3px 5px;
  margin: 0;
  border: none;
}
.mb-import-popup__footer {
  border-top: 1px #5D413A solid;
  background: #F5F3EA;
}
.mb-import-popup__import-error-message {
  color: red;
  margin-left: 10px;
  display: inline-block;
  padding: 4px 6px;
}
`);
class ImportPopup {

  constructor({ attrs: { services }}) {
    this.services = services;
    this.invalid = false;
  }

  oncreate({ dom, attrs: { onclose } }) {
    this.releaseClickOutEventListener = nextTickAddClickOutEventListener(dom, onclose);
  }
  
  onbeforeremove() {
    this.releaseClickOutEventListener();
  }

  view({ attrs: { onclose, onimport }}) {

    const onchange = (value) => {
      this.data = value;
      this.invalid = false;
    }

    const importAction = () => {
      if (this.services.manager.unserialize(this.data)) {
        this.data = null;
        onimport();
      } else {
        this.invalid = true;
      }
    }

    return m('.mb-import-popup__box', [
      m('.mb-import-popup__header', [
        m('.mb-import-popup__close-button', { onclick: onclose }, 'Закрыть')
      ]),
      m('.mb-import-popup__body', [
        m('textarea', { value: this.data, oninput: m.withAttr('value', onchange) })
      ]),
      m('.mb-import-popup__footer', [
        m('.mb-import-popup__import-button', { onclick: importAction }, 'Импорт'),
        this.invalid 
          ? m('.mb-import-popup__import-error-message', 'Некорректный формат данных')
          : null
      ])
    ])
  }

};

styles(`
.mb-manager__box {
  width: 650px;
  border: 1px #5D413A solid;
  background: #fff;
  position: absolute;
  left: 3px;
  top: 3px;
  z-index: 3;
  box-sizing: border-box;
}
.mb-manager__header {
  background: #F5F3EA;
  border-bottom: 1px #5D413A solid;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mb-manager__header-button {
  display: inline-block;
  cursor: pointer;
  color: rgb(89, 44, 8);
  padding: 4px 0 4px 6px;
}
.mb-manager__header-button:last-child {
  padding-right: 6px;
}
.mb-manager__header-button:hover {
  text-decoration: underline;
}
.mb-manager__header-space {
  width: 20px;
  display: inline-block;
}
.mb-manager__list {
  max-height: 72px;
  overflow: auto;
  border-bottom: 1px #5D413A solid;
  margin-bottom: -1px;
  white-space: nowrap;
}
.mb-manager__list-item {
  padding: 0 6px;
  cursor: pointer;
  margin: 4px 0;
  display: table;
}
.mb-manager__list-item:hover {
  text-decoration: underline;
}
.mb-manager__list-item--selected {
  color: rgb(255, 0, 0);
  text-decoration: underline;
}
.mb-manager__list-empty {
  text-align: center;
  border-bottom: 1px #5D413A solid;
  padding: 15px 0;
  margin-bottom: -1px;
}
.mb-manager__confirm-remove {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.mb-manager__confirm-remove-buttons {
  margin-top: 7px;
}
.mb-manager__confirm-remove-button {
  display: inline-block;
  margin: 4px 4px;
  cursor: pointer;
}
.mb-manager__confirm-remove-button:hover {
  text-decoration: underline;
}
.mb-manager__confirm-remove-button--no {
  font-weight: bold;
}
.mb-manager__confirm-remove-button:hover:not(.mb-manager__confirm-remove-button--no) {
  color: red;
}
.mg-manager__body {
  margin-top: 1px;
}
`);
class ManagerComponent {

  constructor({ attrs: { services }}) {
    this.services = services;
    
    this._initSelected();
    this.exportPopup = false;
    this.importPopup = false;
  }
  
  _initSelected() {
    let current = this.services.current.item;
    if (current) {
      let { founded, index } = this.services.manager.searchEquals(current);
      if (founded) {
        this.selected = this.services.manager.items[index];
        return;
      }
    }
    this.selected = this.services.manager.items[0];
  }

  createNew() {
    this.selected = this.services.manager.createNew();
  }
  
  selectItem(item) {
    this.selected = item;
  }
  
  removeSelected() {
    this.confirmRemove = true;
  }
  
  confirmRemoveOk() {
    this.selected = this.services.manager.remove(this.selected);
    this.confirmRemove = false;
  }
  
  confirmRemoveCancel() {
    this.confirmRemove = false;
  }
  
  duplicateSelected() {
    this.selected = this.services.manager.duplicate(this.selected);
  }
  
  updateItem(item) {
    this.selected = this.services.manager.update(item);
  }
  
  view({ attrs: { onclose } }) {
    
    const closeAction = () => {
      onclose();
    };
    
    const exportCloseAction = () => {
      this.exportPopup = false;
    };

    const importCloseAction = () => {
      this.importPopup = false;
    };

    const importAction = () => {
      this.importPopup = false;
      this.selected = null;
    };

    const headerLeft = () => {
      let controls = [];
      
      if (!this.confirmRemove) {
        controls.push(
          m('.mb-manager__header-button', { onclick: this.createNew.bind(this) }, 'Новый')
        );

        if (this.selected) {
          controls.push(
            m('.mb-manager__header-button', { onclick: this.duplicateSelected.bind(this) }, 'Копия'),
            m('.mb-manager__header-button', { onclick: this.removeSelected.bind(this) }, 'Удалить')
          )
        }
      }
      
      return m('.mb-manager__header-left', controls);
    };
    
    const headerRight = () => {
      let controls = [];
      if (!this.confirmRemove) {
        if (this.services.manager.items.length > 0) {
          controls.push(
            m('.mb-manager__header-button', { onclick: () => { this.exportPopup = true } }, 'Экспорт')
          )
        }
        controls.push(
          m('.mb-manager__header-button', { onclick: () => { this.importPopup = true } }, 'Импорт'),
          m('.mb-manager__header-space')
        )
      }
      controls.push(
        m('.mb-manager__header-button', { onclick: closeAction }, 'Закрыть')
      )

      return m('.mb-manager__header-right', controls);
    };
    
    const confirmRemove = () => {
      if (!this.confirmRemove) return null;
      return m('.mb-manager__confirm-remove', [
        m('.mb-manager__confirm-remove-message', [
          `Удалить "${this.selected.name}"?`
        ]),
        m('.mb-manager__confirm-remove-buttons', [
          m('.mb-manager__confirm-remove-button.mb-manager__confirm-remove-button--no', { onclick: this.confirmRemoveCancel.bind(this) }, 'Нет'),
          m('.mb-manager__confirm-remove-button', { onclick: this.confirmRemoveOk.bind(this) }, 'Да')
        ]),
      ])
    };
    
    const list = () => {      
      if (this.confirmRemove) return null;
      let items = this.services.manager.items;
      
      if (items.length === 0) {
        return m('.mb-manager__list-empty', 'Список пуст')
      }
      return m('.mb-manager__list', items.map((item) => {
        return m('.mb-manager__list-item', {
          key: item.id,
          class: (this.selected || {}).id === item.id ? 'mb-manager__list-item--selected' : '', 
          onclick: () => { this.selectItem(item) }
        }, item.name)
      }))
    };
    
    const body = () => {
      if (this.confirmRemove) return null;
      if (!this.selected) return null;
     
      return m('.mb-manager__body', [
        m(EditorComponent, { services: this.services, item: this.selected, onchange: this.updateItem.bind(this), onclose: closeAction })
      ]);
    };
    
    const popups = () => {
      if (this.confirmRemove) return null;

      return [
        this.exportPopup 
          ? m(ExportPopup, { services: this.services, onclose: exportCloseAction })
          : null,
        this.importPopup
          ? m(ImportPopup, { services: this.services, onclose: importCloseAction, onimport: importAction })
          : null
      ]
    }
    
    return m('.mb-manager__box', [
      m('.mb-manager__header', [
        headerLeft(),
        headerRight()
      ]),
      confirmRemove(),
      list(),
      body(),
      popups(),
    ])
  }
}

styles(`
.mb-selector__handler {
  display: flex;
  cursor: pointer;
}
.mb-selector__handler--changing {
  cursor: wait;
}
.mb-selector__info {
  padding: 2px 6px 4px 5px;
  background: #6b6b69;
  color: #f5c137;
  white-space: nowrap;
  border: 1px solid #f5c137;
  border-left: none;
}
.mb-selector__info-error {
  color: red;
}
.mb-selector__triangle-box {
  background: #6b6b69;
  color: #f5c137;
  border: 1px solid #f5c137;
  border-left: none;
  padding: 2px 8px 4px 5px;
  box-sizing: border-box;
  position: relative;
}
.mb-selector__triangle-box:before {
  content: "\\00a0";
}
.mb-selector__triangle {
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #f5c137;
  position: absolute;
  left: 3px;
  top: 8px;
}
.mb-selector__triangle--up {
  transform: rotate(180deg);
}
.mb-selector__list-handler {
  z-index: 3;
  position: relative;
}
.mb-selector__list-box {
  position: absolute;
  top: 0;
  left: 0;
  border: 1px #5D413A solid;
  background: #fff;
}
.mb-selector__list-item {
  padding: 0 6px;
  cursor: pointer;
  margin: 4px 0;
  display: table;
  white-space: nowrap;
}
.mb-selector__list-item:hover .mb-selector__list-item-name {
  text-decoration: underline;
}
.mb-selector__list-item-name--current {
  color: rgb(255, 0, 0);
  text-decoration: underline;
  cursor: default;
}
.mb-selector__list-item-name {
  display: inline-block;
}
.mb-selector__list-item-force {
  display: inline-block;
  margin-left: 5px;
}
.mb-selector__list-item-force:hover {
  text-decoration: underline;
}
.mb-selector__list-footer {
  display: block;
  border-top: 1px #5D413A solid;
  padding: 4px 6px;
  margin: 0;
  background: #F5F3EA;
}
.mb-selector__list-button-cancel {
  cursor: pointer;
  display: inline-block;
}
.mb-selector__list-button-cancel:hover {
  text-decoration: underline;
}
`);
class SelectorComponent {
  
  constructor({ attrs: { services }}) {
    this.services = services;
    this.dropped = false;
    this.changing = false;
    this.error = false;

  }

  oncreate({ dom }) {
    this.releaseClickOutEventListener = addClickOutEventListener(dom, () => {
      this.dropped = false;
    });
  }
  
  onbeforeremove() {
    this.releaseClickOutEventListener();
  }

  drop() {
    if (this.changing) return;
    this.dropped = !this.dropped;
  }
  
  view() {
    let items = this.services.manager.items;
    if (!items.length) return null;
    
    let current = this.services.current.item;
    
    const selectAction = (item, force) => {
      if (item === current && !force) return;
      
      this.dropped = false;
      this.changing = true;
      
      this.services.current.change(item, force)
        .then(() => {
          this.changing = false;
          this.error = false;
        }, (e) => {
          console.error(e);
          this.changing = false;
          this.error = true;
        });
    };
    
    const list = () => {
      if (!this.dropped) return null;
      
      const box = m('.mb-selector__list-box', [
        m('.mb-selector__list', 
          items.map((item) => {
            return m('.mb-selector__list-item', [
              m('.mb-selector__list-item-name', 
                this.services.current.equals(item) 
                  ? { class: 'mb-selector__list-item-name--current' }
                  : { onclick: () => { selectAction(item) } }, 
                item.name),
              m('.mb-selector__list-item-force', { onclick: () => { selectAction(item, true) }}, '[*]')
            ])
          })),
        current 
          ? m('.mb-selector__list-footer', 
              m('.mb-selector__list-button-cancel', { onclick: () => { selectAction(null); } }, 'Сбросить'))
          : null,
      ]);
      
      return m('.mb-selector__list-handler', box);
    };
    
    const info = () => {
      if (!this.changing && !current && !this.error) return null;
      
      const text = () => {
        if (this.changing) {
          return 'Смена билда...'
        } else if (this.error) {
          return m('.mb-selector__info-error', 'Ошибка смены билда!')
        } else {
          return [
            this.services.current.isExpired() ? '*' : '',
            current.name
          ]
        }
      };
      
      return m('.mb-selector__info', text());
    };
    
    return m('.mb-selector__box', [
      m('.mb-selector__handler', { onclick: this.drop.bind(this), class: this.changing ? 'mb-selector__handler--changing' : '' }, [
        info(),
        m('.mb-selector__triangle-box', 
          m('.mb-selector__triangle', { class: this.dropped ? 'mb-selector__triangle--up' : '' }))
      ]),
      list()
    ])
  }
  
}


styles(`
.mb-app__handler {
  display: flex;
}
.mb-app__handler-editor-button {
  background: #6b6b69;
  color: #f5c137;
  border: 1px solid #f5c137;
  padding: 2px 6px 4px 6px;
  cursor: pointer;
}
`);
class AppComponent {
  
  constructor() {
    this.manager = false;
    this.services = new ServiceContainer();
    
    this.services.inventory.syncNamesIfAvailable();
  }
  
  view() {
    return m('.mb-app__box', [
      m('.mb-app__handler', [
        m('.mb-app__handler-editor-button', 
          { onclick: () => { this.manager = true } }, 
          '+'),
        m(SelectorComponent, { services: this.services })
      ]),
      this.manager 
        ? m(ManagerComponent, { services: this.services, onclose: () => { this.manager = false } })
        : null
    ]);
  }
}


function mount() {
  let container = document.querySelector('body table table td');
  if (!container) return
  
  let checkAllowedPage = document.querySelector('a[href*="home.php"]');
  if (!checkAllowedPage) return;
  
  let root = document.createElement('div');
  root.style.position = 'absolute';
  root.style.top = '0';
  root.style.left = '0';
  
  container.style.position = 'relative';
  container.appendChild(root);
  m.mount(root, AppComponent);
}

function styles(content = null, flush = false) {
  let task = styles.task || {};
  
  if (content) {
    if (task.scheduled) {
      task.content += content;
    }
    else {
      let task = styles.task = {
        content,
        scheduled: true
      }
      task.timer = setTimeout(finish, 0, task)
    }    
  }
  
  if (flush && task.scheduled) {
    clearInterval(task.timer);
    finish(task);
  }
  
  function finish(task) {
    let head = document.querySelector('head');
    head.insertAdjacentHTML('beforeEnd', 
      `<style type="text/css">${task.content}</style>`);
    task.scheduled = false; 
  }
}

function uniqid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(1);
}

function deepCopy(value) {
  if (!value) return value;
  if (value instanceof Array) {
    return value.map(deepCopy);
  }
  if (typeof value === 'object') {
    let obj = {};
    for (let key of Object.keys(value)) {
      obj[key] = deepCopy(value[key])
    }
    return obj;
  }
  return value;
}

function deepEquals(a, b) {
  if (a === b) return true;
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }
  if (!a || !b) return false;
  if (typeof a === 'object' && typeof b === 'object') {
    let keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    for (let key of keys) {
      if (!b.hasOwnProperty(key)) return false;
      if (!deepEquals(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

function addClickOutEventListener(dom, fn) {
  const listener = (event) => {    
    let node = event.target;
    while(node && node.parentNode) {
      if (node === dom) {
        return;
      }
      node = node.parentNode;
    }
    
    fn();
    m.redraw();
  };
  
  const body = document.body;
  body.addEventListener('click', listener);
  return () => {
    body.removeEventListener('click', listener);
  }
  
}

function nextTickAddClickOutEventListener(dom, fn) {

  let releaseEventListener = null;
  let timeout = setTimeout(() => {
    timeout = null;
    releaseEventListener = addClickOutEventListener(dom, fn);
  });

  return () => {
    if (timeout) clearTimeout(timeout);
    if (releaseEventListener) releaseEventListener();
  }
}

class LocalStorageDriver {
  
  constructor(key) {
    this.key = key;
  }
  
  fetch() {
    let text = localStorage.getItem(this.key);
    let data;
    try {
      data = JSON.parse(text);
    }
    catch(e) {
      data = null;
    }
    return data;
  }
  
  put(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
  
}

class LocalStorageArrayDriver extends LocalStorageDriver {
  
  fetch() {
    let data = super.fetch();
    if (!Array.isArray(data)) {
      data = [];
    }
    return data;    
  }
  
}

function PromiseMDecorator(promise) {
  const proxyWithRedraw = (data) => {
    setTimeout(m.redraw.bind(m));
    return data;
  }
  return promise.then(
    proxyWithRedraw, 
    (data) => proxyWithRedraw(Promise.reject(data))
  );
}

function httpPlainRequest(method, url, data) {
  if (method === 'FORM') {
    let form = new FormData();
    for (let key of Object.keys(data)) {
      form.append(key, data[key]);
    }
    data = form;
    method = 'POST';
  }

  return m.request({ method, url, data,
    extract: ({ responseText }) => responseText
  });
}

function main() {
  try {
    styles(null, true);
    mount();
  }
  catch(e) {
    console.error(e);
  }
}

setTimeout(main);



// Mithrill 1.1.1

;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
  return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
  if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
  if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
  return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    children[i] = Vnode.normalize(children[i])
  }
  return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function compileSelector(selector) {
  var match, tag = "div", classes = [], attrs = {}
  while (match = selectorParser.exec(selector)) {
    var type = match[1], value = match[2]
    if (type === "" && value !== "") tag = value
    else if (type === "#") attrs.id = value
    else if (type === ".") classes.push(value)
    else if (match[3][0] === "[") {
      var attrValue = match[6]
      if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
      if (match[4] === "class") classes.push(attrValue)
      else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
    }
  }
  if (classes.length > 0) attrs.className = classes.join(" ")
  return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
  var hasAttrs = false, childList, text
  var className = attrs.className || attrs.class
  for (var key in state.attrs) {
    if (hasOwn.call(state.attrs, key)) {
      attrs[key] = state.attrs[key]
    }
  }
  if (className !== undefined) {
    if (attrs.class !== undefined) {
      attrs.class = undefined
      attrs.className = className
    }
    if (state.attrs.className != null) {
      attrs.className = state.attrs.className + " " + className
    }
  }
  for (var key in attrs) {
    if (hasOwn.call(attrs, key) && key !== "key") {
      hasAttrs = true
      break
    }
  }
  if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
    text = children[0].children
  } else {
    childList = children
  }
  return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
  // Because sloppy mode sucks
  var attrs = arguments[1], start = 2, children
  if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
    throw Error("The selector must be either a string or a component.");
  }
  if (typeof selector === "string") {
    var cached = selectorCache[selector] || compileSelector(selector)
  }
  if (attrs == null) {
    attrs = {}
  } else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
    attrs = {}
    start = 1
  }
  if (arguments.length === start + 1) {
    children = arguments[start]
    if (!Array.isArray(children)) children = [children]
  } else {
    children = []
    while (start < arguments.length) children.push(arguments[start++])
  }
  var normalized = Vnode.normalizeChildren(children)
  if (typeof selector === "string") {
    return execSelector(cached, attrs, normalized)
  } else {
    return Vnode(selector, attrs.key, attrs, normalized)
  }
}
hyperscript.trust = function(html) {
  if (html == null) html = ""
  return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
  return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
  if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
  if (typeof executor !== "function") throw new TypeError("executor must be a function")
  var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
  var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
  var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
  function handler(list, shouldAbsorb) {
    return function execute(value) {
      var then
      try {
        if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
          if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
          executeOnce(then.bind(value))
        }
        else {
          callAsync(function() {
            if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
            for (var i = 0; i < list.length; i++) list[i](value)
            resolvers.length = 0, rejectors.length = 0
            instance.state = shouldAbsorb
            instance.retry = function() {execute(value)}
          })
        }
      }
      catch (e) {
        rejectCurrent(e)
      }
    }
  }
  function executeOnce(then) {
    var runs = 0
    function run(fn) {
      return function(value) {
        if (runs++ > 0) return
        fn(value)
      }
    }
    var onerror = run(rejectCurrent)
    try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
  }
  executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
  var self = this, instance = self._instance
  function handle(callback, list, next, state) {
    list.push(function(value) {
      if (typeof callback !== "function") next(value)
      else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
    })
    if (typeof instance.retry === "function" && state === instance.state) instance.retry()
  }
  var resolveNext, rejectNext
  var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
  handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
  return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
  return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
  if (value instanceof PromisePolyfill) return value
  return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
  return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
  return new PromisePolyfill(function(resolve, reject) {
    var total = list.length, count = 0, values = []
    if (list.length === 0) resolve([])
    else for (var i = 0; i < list.length; i++) {
      (function(i) {
        function consume(value) {
          count++
          values[i] = value
          if (count === total) resolve(values)
        }
        if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
          list[i].then(consume, reject)
        }
        else consume(list[i])
      })(i)
    }
  })
}
PromisePolyfill.race = function(list) {
  return new PromisePolyfill(function(resolve, reject) {
    for (var i = 0; i < list.length; i++) {
      list[i].then(resolve, reject)
    }
  })
}
if (typeof window !== "undefined") {
  if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
  var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
  if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
  var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
  if (Object.prototype.toString.call(object) !== "[object Object]") return ""
  var args = []
  for (var key0 in object) {
    destructure(key0, object[key0])
  }
  return args.join("&")
  function destructure(key0, value) {
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        destructure(key0 + "[" + i + "]", value[i])
      }
    }
    else if (Object.prototype.toString.call(value) === "[object Object]") {
      for (var i in value) {
        destructure(key0 + "[" + i + "]", value[i])
      }
    }
    else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
  }
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
  var callbackCount = 0
  var oncompletion
  function setCompletionCallback(callback) {oncompletion = callback}
  function finalizer() {
    var count = 0
    function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
    return function finalize(promise0) {
      var then0 = promise0.then
      promise0.then = function() {
        count++
        var next = then0.apply(promise0, arguments)
        next.then(complete, function(e) {
          complete()
          if (count === 0) throw e
        })
        return finalize(next)
      }
      return promise0
    }
  }
  function normalize(args, extra) {
    if (typeof args === "string") {
      var url = args
      args = extra || {}
      if (args.url == null) args.url = url
    }
    return args
  }
  function request(args, extra) {
    var finalize = finalizer()
    args = normalize(args, extra)
    var promise0 = new Promise(function(resolve, reject) {
      if (args.method == null) args.method = "GET"
      args.method = args.method.toUpperCase()
      var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
      if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
      if (typeof args.deserialize !== "function") args.deserialize = deserialize
      if (typeof args.extract !== "function") args.extract = extract
      args.url = interpolate(args.url, args.data)
      if (useBody) args.data = args.serialize(args.data)
      else args.url = assemble(args.url, args.data)
      var xhr = new $window.XMLHttpRequest(),
        aborted = false,
        _abort = xhr.abort
      xhr.abort = function abort() {
        aborted = true
        _abort.call(xhr)
      }
      xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
      if (args.serialize === JSON.stringify && useBody) {
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
      }
      if (args.deserialize === deserialize) {
        xhr.setRequestHeader("Accept", "application/json, text/*")
      }
      if (args.withCredentials) xhr.withCredentials = args.withCredentials
      for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
        xhr.setRequestHeader(key, args.headers[key])
      }
      if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
      xhr.onreadystatechange = function() {
        // Don't throw errors on xhr.abort().
        if(aborted) return
        if (xhr.readyState === 4) {
          try {
            var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
              resolve(cast(args.type, response))
            }
            else {
              var error = new Error(xhr.responseText)
              for (var key in response) error[key] = response[key]
              reject(error)
            }
          }
          catch (e) {
            reject(e)
          }
        }
      }
      if (useBody && (args.data != null)) xhr.send(args.data)
      else xhr.send()
    })
    return args.background === true ? promise0 : finalize(promise0)
  }
  function jsonp(args, extra) {
    var finalize = finalizer()
    args = normalize(args, extra)
    var promise0 = new Promise(function(resolve, reject) {
      var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
      var script = $window.document.createElement("script")
      $window[callbackName] = function(data) {
        script.parentNode.removeChild(script)
        resolve(cast(args.type, data))
        delete $window[callbackName]
      }
      script.onerror = function() {
        script.parentNode.removeChild(script)
        reject(new Error("JSONP request failed"))
        delete $window[callbackName]
      }
      if (args.data == null) args.data = {}
      args.url = interpolate(args.url, args.data)
      args.data[args.callbackKey || "callback"] = callbackName
      script.src = assemble(args.url, args.data)
      $window.document.documentElement.appendChild(script)
    })
    return args.background === true? promise0 : finalize(promise0)
  }
  function interpolate(url, data) {
    if (data == null) return url
    var tokens = url.match(/:[^\/]+/gi) || []
    for (var i = 0; i < tokens.length; i++) {
      var key = tokens[i].slice(1)
      if (data[key] != null) {
        url = url.replace(tokens[i], data[key])
      }
    }
    return url
  }
  function assemble(url, data) {
    var querystring = buildQueryString(data)
    if (querystring !== "") {
      var prefix = url.indexOf("?") < 0 ? "?" : "&"
      url += prefix + querystring
    }
    return url
  }
  function deserialize(data) {
    try {return data !== "" ? JSON.parse(data) : null}
    catch (e) {throw new Error(data)}
  }
  function extract(xhr) {return xhr.responseText}
  function cast(type0, data) {
    if (typeof type0 === "function") {
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          data[i] = new type0(data[i])
        }
      }
      else return new type0(data)
    }
    return data
  }
  return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
  var $doc = $window.document
  var $emptyFragment = $doc.createDocumentFragment()
  var nameSpace = {
    svg: "http://www.w3.org/2000/svg",
    math: "http://www.w3.org/1998/Math/MathML"
  }
  var onevent
  function setEventCallback(callback) {return onevent = callback}
  function getNameSpace(vnode) {
    return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
  }
  //create
  function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
    for (var i = start; i < end; i++) {
      var vnode = vnodes[i]
      if (vnode != null) {
        createNode(parent, vnode, hooks, ns, nextSibling)
      }
    }
  }
  function createNode(parent, vnode, hooks, ns, nextSibling) {
    var tag = vnode.tag
    if (typeof tag === "string") {
      vnode.state = {}
      if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
      switch (tag) {
        case "#": return createText(parent, vnode, nextSibling)
        case "<": return createHTML(parent, vnode, nextSibling)
        case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
        default: return createElement(parent, vnode, hooks, ns, nextSibling)
      }
    }
    else return createComponent(parent, vnode, hooks, ns, nextSibling)
  }
  function createText(parent, vnode, nextSibling) {
    vnode.dom = $doc.createTextNode(vnode.children)
    insertNode(parent, vnode.dom, nextSibling)
    return vnode.dom
  }
  function createHTML(parent, vnode, nextSibling) {
    var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
    var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
    var temp = $doc.createElement(parent1)
    temp.innerHTML = vnode.children
    vnode.dom = temp.firstChild
    vnode.domSize = temp.childNodes.length
    var fragment = $doc.createDocumentFragment()
    var child
    while (child = temp.firstChild) {
      fragment.appendChild(child)
    }
    insertNode(parent, fragment, nextSibling)
    return fragment
  }
  function createFragment(parent, vnode, hooks, ns, nextSibling) {
    var fragment = $doc.createDocumentFragment()
    if (vnode.children != null) {
      var children = vnode.children
      createNodes(fragment, children, 0, children.length, hooks, null, ns)
    }
    vnode.dom = fragment.firstChild
    vnode.domSize = fragment.childNodes.length
    insertNode(parent, fragment, nextSibling)
    return fragment
  }
  function createElement(parent, vnode, hooks, ns, nextSibling) {
    var tag = vnode.tag
    var attrs2 = vnode.attrs
    var is = attrs2 && attrs2.is
    ns = getNameSpace(vnode) || ns
    var element = ns ?
      is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
      is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
    vnode.dom = element
    if (attrs2 != null) {
      setAttrs(vnode, attrs2, ns)
    }
    insertNode(parent, element, nextSibling)
    if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
      setContentEditable(vnode)
    }
    else {
      if (vnode.text != null) {
        if (vnode.text !== "") element.textContent = vnode.text
        else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
      }
      if (vnode.children != null) {
        var children = vnode.children
        createNodes(element, children, 0, children.length, hooks, null, ns)
        setLateAttrs(vnode)
      }
    }
    return element
  }
  function initComponent(vnode, hooks) {
    var sentinel
    if (typeof vnode.tag.view === "function") {
      vnode.state = Object.create(vnode.tag)
      sentinel = vnode.state.view
      if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
      sentinel.$$reentrantLock$$ = true
    } else {
      vnode.state = void 0
      sentinel = vnode.tag
      if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
      sentinel.$$reentrantLock$$ = true
      vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
    }
    vnode._state = vnode.state
    if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
    initLifecycle(vnode._state, vnode, hooks)
    vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
    if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
    sentinel.$$reentrantLock$$ = null
  }
  function createComponent(parent, vnode, hooks, ns, nextSibling) {
    initComponent(vnode, hooks)
    if (vnode.instance != null) {
      var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
      vnode.dom = vnode.instance.dom
      vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
      insertNode(parent, element, nextSibling)
      return element
    }
    else {
      vnode.domSize = 0
      return $emptyFragment
    }
  }
  //update
  function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
    if (old === vnodes || old == null && vnodes == null) return
    else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
    else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
    else {
      if (old.length === vnodes.length) {
        var isUnkeyed = false
        for (var i = 0; i < vnodes.length; i++) {
          if (vnodes[i] != null && old[i] != null) {
            isUnkeyed = vnodes[i].key == null && old[i].key == null
            break
          }
        }
        if (isUnkeyed) {
          for (var i = 0; i < old.length; i++) {
            if (old[i] === vnodes[i]) continue
            else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
            else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
            else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
          }
          return
        }
      }
      recycling = recycling || isRecyclable(old, vnodes)
      if (recycling) {
        var pool = old.pool
        old = old.concat(old.pool)
      }
      var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
      while (oldEnd >= oldStart && end >= start) {
        var o = old[oldStart], v = vnodes[start]
        if (o === v && !recycling) oldStart++, start++
        else if (o == null) oldStart++
        else if (v == null) start++
        else if (o.key === v.key) {
          var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
          oldStart++, start++
          updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
          if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
        }
        else {
          var o = old[oldEnd]
          if (o === v && !recycling) oldEnd--, start++
          else if (o == null) oldEnd--
          else if (v == null) start++
          else if (o.key === v.key) {
            var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
            updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
            if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
            oldEnd--, start++
          }
          else break
        }
      }
      while (oldEnd >= oldStart && end >= start) {
        var o = old[oldEnd], v = vnodes[end]
        if (o === v && !recycling) oldEnd--, end--
        else if (o == null) oldEnd--
        else if (v == null) end--
        else if (o.key === v.key) {
          var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
          updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
          if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
          if (o.dom != null) nextSibling = o.dom
          oldEnd--, end--
        }
        else {
          if (!map) map = getKeyMap(old, oldEnd)
          if (v != null) {
            var oldIndex = map[v.key]
            if (oldIndex != null) {
              var movable = old[oldIndex]
              var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
              updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
              insertNode(parent, toFragment(movable), nextSibling)
              old[oldIndex].skip = true
              if (movable.dom != null) nextSibling = movable.dom
            }
            else {
              var dom = createNode(parent, v, hooks, ns, nextSibling)
              nextSibling = dom
            }
          }
          end--
        }
        if (end < start) break
      }
      createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
      removeNodes(old, oldStart, oldEnd + 1, vnodes)
    }
  }
  function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
    var oldTag = old.tag, tag = vnode.tag
    if (oldTag === tag) {
      vnode.state = old.state
      vnode._state = old._state
      vnode.events = old.events
      if (!recycling && shouldNotUpdate(vnode, old)) return
      if (typeof oldTag === "string") {
        if (vnode.attrs != null) {
          if (recycling) {
            vnode.state = {}
            initLifecycle(vnode.attrs, vnode, hooks)
          }
          else updateLifecycle(vnode.attrs, vnode, hooks)
        }
        switch (oldTag) {
          case "#": updateText(old, vnode); break
          case "<": updateHTML(parent, old, vnode, nextSibling); break
          case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
          default: updateElement(old, vnode, recycling, hooks, ns)
        }
      }
      else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
    }
    else {
      removeNode(old, null)
      createNode(parent, vnode, hooks, ns, nextSibling)
    }
  }
  function updateText(old, vnode) {
    if (old.children.toString() !== vnode.children.toString()) {
      old.dom.nodeValue = vnode.children
    }
    vnode.dom = old.dom
  }
  function updateHTML(parent, old, vnode, nextSibling) {
    if (old.children !== vnode.children) {
      toFragment(old)
      createHTML(parent, vnode, nextSibling)
    }
    else vnode.dom = old.dom, vnode.domSize = old.domSize
  }
  function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
    updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
    var domSize = 0, children = vnode.children
    vnode.dom = null
    if (children != null) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i]
        if (child != null && child.dom != null) {
          if (vnode.dom == null) vnode.dom = child.dom
          domSize += child.domSize || 1
        }
      }
      if (domSize !== 1) vnode.domSize = domSize
    }
  }
  function updateElement(old, vnode, recycling, hooks, ns) {
    var element = vnode.dom = old.dom
    ns = getNameSpace(vnode) || ns
    if (vnode.tag === "textarea") {
      if (vnode.attrs == null) vnode.attrs = {}
      if (vnode.text != null) {
        vnode.attrs.value = vnode.text //FIXME handle0 multiple children
        vnode.text = undefined
      }
    }
    updateAttrs(vnode, old.attrs, vnode.attrs, ns)
    if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
      setContentEditable(vnode)
    }
    else if (old.text != null && vnode.text != null && vnode.text !== "") {
      if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
    }
    else {
      if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
      if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
      updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
    }
  }
  function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
    if (recycling) {
      initComponent(vnode, hooks)
    } else {
      vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
      if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
      if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
      updateLifecycle(vnode._state, vnode, hooks)
    }
    if (vnode.instance != null) {
      if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
      else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
      vnode.dom = vnode.instance.dom
      vnode.domSize = vnode.instance.domSize
    }
    else if (old.instance != null) {
      removeNode(old.instance, null)
      vnode.dom = undefined
      vnode.domSize = 0
    }
    else {
      vnode.dom = old.dom
      vnode.domSize = old.domSize
    }
  }
  function isRecyclable(old, vnodes) {
    if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
      var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
      var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
      var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
      if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
        return true
      }
    }
    return false
  }
  function getKeyMap(vnodes, end) {
    var map = {}, i = 0
    for (var i = 0; i < end; i++) {
      var vnode = vnodes[i]
      if (vnode != null) {
        var key2 = vnode.key
        if (key2 != null) map[key2] = i
      }
    }
    return map
  }
  function toFragment(vnode) {
    var count0 = vnode.domSize
    if (count0 != null || vnode.dom == null) {
      var fragment = $doc.createDocumentFragment()
      if (count0 > 0) {
        var dom = vnode.dom
        while (--count0) fragment.appendChild(dom.nextSibling)
        fragment.insertBefore(dom, fragment.firstChild)
      }
      return fragment
    }
    else return vnode.dom
  }
  function getNextSibling(vnodes, i, nextSibling) {
    for (; i < vnodes.length; i++) {
      if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
    }
    return nextSibling
  }
  function insertNode(parent, dom, nextSibling) {
    if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
    else parent.appendChild(dom)
  }
  function setContentEditable(vnode) {
    var children = vnode.children
    if (children != null && children.length === 1 && children[0].tag === "<") {
      var content = children[0].children
      if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
    }
    else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
  }
  //remove
  function removeNodes(vnodes, start, end, context) {
    for (var i = start; i < end; i++) {
      var vnode = vnodes[i]
      if (vnode != null) {
        if (vnode.skip) vnode.skip = false
        else removeNode(vnode, context)
      }
    }
  }
  function removeNode(vnode, context) {
    var expected = 1, called = 0
    if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
      var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
      if (result != null && typeof result.then === "function") {
        expected++
        result.then(continuation, continuation)
      }
    }
    if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
      var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
      if (result != null && typeof result.then === "function") {
        expected++
        result.then(continuation, continuation)
      }
    }
    continuation()
    function continuation() {
      if (++called === expected) {
        onremove(vnode)
        if (vnode.dom) {
          var count0 = vnode.domSize || 1
          if (count0 > 1) {
            var dom = vnode.dom
            while (--count0) {
              removeNodeFromDOM(dom.nextSibling)
            }
          }
          removeNodeFromDOM(vnode.dom)
          if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
            if (!context.pool) context.pool = [vnode]
            else context.pool.push(vnode)
          }
        }
      }
    }
  }
  function removeNodeFromDOM(node) {
    var parent = node.parentNode
    if (parent != null) parent.removeChild(node)
  }
  function onremove(vnode) {
    if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
    if (typeof vnode.tag !== "string" && typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
    if (vnode.instance != null) onremove(vnode.instance)
    else {
      var children = vnode.children
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          var child = children[i]
          if (child != null) onremove(child)
        }
      }
    }
  }
  //attrs2
  function setAttrs(vnode, attrs2, ns) {
    for (var key2 in attrs2) {
      setAttr(vnode, key2, null, attrs2[key2], ns)
    }
  }
  function setAttr(vnode, key2, old, value, ns) {
    var element = vnode.dom
    if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
    var nsLastIndex = key2.indexOf(":")
    if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
      element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
    }
    else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
    else if (key2 === "style") updateStyle(element, old, value)
    else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
      if (key2 === "value") {
        var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
        //setting input[value] to same value by typing on focused element moves cursor to end in Chrome
        if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
        //setting select[value] to same value while having select open blinks select dropdown in Chrome
        if (vnode.tag === "select") {
          if (value === null) {
            if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
          } else {
            if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
          }
        }
        //setting option[value] to same value while having select open blinks select dropdown in Chrome
        if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
      }
      // If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
      if (vnode.tag === "input" && key2 === "type") {
        element.setAttribute(key2, value)
        return
      }
      element[key2] = value
    }
    else {
      if (typeof value === "boolean") {
        if (value) element.setAttribute(key2, "")
        else element.removeAttribute(key2)
      }
      else element.setAttribute(key2 === "className" ? "class" : key2, value)
    }
  }
  function setLateAttrs(vnode) {
    var attrs2 = vnode.attrs
    if (vnode.tag === "select" && attrs2 != null) {
      if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
      if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
    }
  }
  function updateAttrs(vnode, old, attrs2, ns) {
    if (attrs2 != null) {
      for (var key2 in attrs2) {
        setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
      }
    }
    if (old != null) {
      for (var key2 in old) {
        if (attrs2 == null || !(key2 in attrs2)) {
          if (key2 === "className") key2 = "class"
          if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
          else if (key2 !== "key") vnode.dom.removeAttribute(key2)
        }
      }
    }
  }
  function isFormAttribute(vnode, attr) {
    return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
  }
  function isLifecycleMethod(attr) {
    return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
  }
  function isAttribute(attr) {
    return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
  }
  function isCustomElement(vnode){
    return vnode.attrs.is || vnode.tag.indexOf("-") > -1
  }
  function hasIntegrationMethods(source) {
    return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
  }
  //style
  function updateStyle(element, old, style) {
    if (old === style) element.style.cssText = "", old = null
    if (style == null) element.style.cssText = ""
    else if (typeof style === "string") element.style.cssText = style
    else {
      if (typeof old === "string") element.style.cssText = ""
      for (var key2 in style) {
        element.style[key2] = style[key2]
      }
      if (old != null && typeof old !== "string") {
        for (var key2 in old) {
          if (!(key2 in style)) element.style[key2] = ""
        }
      }
    }
  }
  //event
  function updateEvent(vnode, key2, value) {
    var element = vnode.dom
    var callback = typeof onevent !== "function" ? value : function(e) {
      var result = value.call(element, e)
      onevent.call(element, e)
      return result
    }
    if (key2 in element) element[key2] = typeof value === "function" ? callback : null
    else {
      var eventName = key2.slice(2)
      if (vnode.events === undefined) vnode.events = {}
      if (vnode.events[key2] === callback) return
      if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
      if (typeof value === "function") {
        vnode.events[key2] = callback
        element.addEventListener(eventName, vnode.events[key2], false)
      }
    }
  }
  //lifecycle
  function initLifecycle(source, vnode, hooks) {
    if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
    if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
  }
  function updateLifecycle(source, vnode, hooks) {
    if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
  }
  function shouldNotUpdate(vnode, old) {
    var forceVnodeUpdate, forceComponentUpdate
    if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
    if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
    if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
      vnode.dom = old.dom
      vnode.domSize = old.domSize
      vnode.instance = old.instance
      return true
    }
    return false
  }
  function render(dom, vnodes) {
    if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
    var hooks = []
    var active = $doc.activeElement
    var namespace = dom.namespaceURI
    // First time0 rendering into a node clears it out
    if (dom.vnodes == null) dom.textContent = ""
    if (!Array.isArray(vnodes)) vnodes = [vnodes]
    updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
    dom.vnodes = vnodes
    for (var i = 0; i < hooks.length; i++) hooks[i]()
    if ($doc.activeElement !== active) active.focus()
  }
  return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
  //60fps translates to 16.6ms, round it down since setTimeout requires int
  var time = 16
  var last = 0, pending = null
  var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
  return function() {
    var now = Date.now()
    if (last === 0 || now - last >= time) {
      last = now
      callback()
    }
    else if (pending === null) {
      pending = timeout(function() {
        pending = null
        callback()
        last = Date.now()
      }, time - (now - last))
    }
  }
}
var _11 = function($window) {
  var renderService = coreRenderer($window)
  renderService.setEventCallback(function(e) {
    if (e.redraw !== false) redraw()
  })
  var callbacks = []
  function subscribe(key1, callback) {
    unsubscribe(key1)
    callbacks.push(key1, throttle(callback))
  }
  function unsubscribe(key1) {
    var index = callbacks.indexOf(key1)
    if (index > -1) callbacks.splice(index, 2)
  }
  function redraw() {
    for (var i = 1; i < callbacks.length; i += 2) {
      callbacks[i]()
    }
  }
  return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
  return function(root, component) {
    if (component === null) {
      redrawService0.render(root, [])
      redrawService0.unsubscribe(root)
      return
    }
    
    if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
    
    var run0 = function() {
      redrawService0.render(root, Vnode(component))
    }
    redrawService0.subscribe(root, run0)
    redrawService0.redraw()
  }
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
  if (string === "" || string == null) return {}
  if (string.charAt(0) === "?") string = string.slice(1)
  var entries = string.split("&"), data0 = {}, counters = {}
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i].split("=")
    var key5 = decodeURIComponent(entry[0])
    var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
    if (value === "true") value = true
    else if (value === "false") value = false
    var levels = key5.split(/\]\[?|\[/)
    var cursor = data0
    if (key5.indexOf("[") > -1) levels.pop()
    for (var j = 0; j < levels.length; j++) {
      var level = levels[j], nextLevel = levels[j + 1]
      var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
      var isValue = j === levels.length - 1
      if (level === "") {
        var key5 = levels.slice(0, j).join()
        if (counters[key5] == null) counters[key5] = 0
        level = counters[key5]++
      }
      if (cursor[level] == null) {
        cursor[level] = isValue ? value : isNumber ? [] : {}
      }
      cursor = cursor[level]
    }
  }
  return data0
}
var coreRouter = function($window) {
  var supportsPushState = typeof $window.history.pushState === "function"
  var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
  function normalize1(fragment0) {
    var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
    if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
    return data
  }
  var asyncId
  function debounceAsync(callback0) {
    return function() {
      if (asyncId != null) return
      asyncId = callAsync0(function() {
        asyncId = null
        callback0()
      })
    }
  }
  function parsePath(path, queryData, hashData) {
    var queryIndex = path.indexOf("?")
    var hashIndex = path.indexOf("#")
    var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
    if (queryIndex > -1) {
      var queryEnd = hashIndex > -1 ? hashIndex : path.length
      var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
      for (var key4 in queryParams) queryData[key4] = queryParams[key4]
    }
    if (hashIndex > -1) {
      var hashParams = parseQueryString(path.slice(hashIndex + 1))
      for (var key4 in hashParams) hashData[key4] = hashParams[key4]
    }
    return path.slice(0, pathEnd)
  }
  var router = {prefix: "#!"}
  router.getPath = function() {
    var type2 = router.prefix.charAt(0)
    switch (type2) {
      case "#": return normalize1("hash").slice(router.prefix.length)
      case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
      default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
    }
  }
  router.setPath = function(path, data, options) {
    var queryData = {}, hashData = {}
    path = parsePath(path, queryData, hashData)
    if (data != null) {
      for (var key4 in data) queryData[key4] = data[key4]
      path = path.replace(/:([^\/]+)/g, function(match2, token) {
        delete queryData[token]
        return data[token]
      })
    }
    var query = buildQueryString(queryData)
    if (query) path += "?" + query
    var hash = buildQueryString(hashData)
    if (hash) path += "#" + hash
    if (supportsPushState) {
      var state = options ? options.state : null
      var title = options ? options.title : null
      $window.onpopstate()
      if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
      else $window.history.pushState(state, title, router.prefix + path)
    }
    else $window.location.href = router.prefix + path
  }
  router.defineRoutes = function(routes, resolve, reject) {
    function resolveRoute() {
      var path = router.getPath()
      var params = {}
      var pathname = parsePath(path, params, params)
      var state = $window.history.state
      if (state != null) {
        for (var k in state) params[k] = state[k]
      }
      for (var route0 in routes) {
        var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
        if (matcher.test(pathname)) {
          pathname.replace(matcher, function() {
            var keys = route0.match(/:[^\/]+/g) || []
            var values = [].slice.call(arguments, 1, -2)
            for (var i = 0; i < keys.length; i++) {
              params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
            }
            resolve(routes[route0], params, path, route0)
          })
          return
        }
      }
      reject(path, params)
    }
    if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
    else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
    resolveRoute()
  }
  return router
}
var _20 = function($window, redrawService0) {
  var routeService = coreRouter($window)
  var identity = function(v) {return v}
  var render1, component, attrs3, currentPath, lastUpdate
  var route = function(root, defaultRoute, routes) {
    if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
    var run1 = function() {
      if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
    }
    var bail = function(path) {
      if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
      else throw new Error("Could not resolve default route " + defaultRoute)
    }
    routeService.defineRoutes(routes, function(payload, params, path) {
      var update = lastUpdate = function(routeResolver, comp) {
        if (update !== lastUpdate) return
        component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
        attrs3 = params, currentPath = path, lastUpdate = null
        render1 = (routeResolver.render || identity).bind(routeResolver)
        run1()
      }
      if (payload.view || typeof payload === "function") update({}, payload)
      else {
        if (payload.onmatch) {
          Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
            update(payload, resolved)
          }, bail)
        }
        else update(payload, "div")
      }
    }, bail)
    redrawService0.subscribe(root, run1)
  }
  route.set = function(path, data, options) {
    if (lastUpdate != null) options = {replace: true}
    lastUpdate = null
    routeService.setPath(path, data, options)
  }
  route.get = function() {return currentPath}
  route.prefix = function(prefix0) {routeService.prefix = prefix0}
  route.link = function(vnode1) {
    vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
    vnode1.dom.onclick = function(e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
      e.preventDefault()
      e.redraw = false
      var href = this.getAttribute("href")
      if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
      route.set(href, undefined, undefined)
    }
  }
  route.param = function(key3) {
    if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
    return attrs3
  }
  return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
  return function(e) {
    callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
  }
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.1"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
