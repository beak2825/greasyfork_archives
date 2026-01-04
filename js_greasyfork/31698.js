// ==UserScript==
// @name         TW Work+
// @namespace    Johnny
// @author       Johnny
// @version      1.2
// @description  List of all jobs, best items, nearest jobs for The West Classic
// @match        https://classic.the-west.net/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31698/TW%20Work%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/31698/TW%20Work%2B.meta.js
// ==/UserScript==

window.WorkPlus = {
  windowName: 'WorkPlus',
  nearestJobs: [],
  sort: {
    'method': 'experience',
    'direction': 'desc',
    'duration': 120,
    'available': false
  },

  init: function() {
    WorkPlus.addCss();
    WorkPlus.addMenuButton();
    WorkPlus.sortJobs(WorkPlus.sort.method, WorkPlus.sort.direction);
  },

  addCss: function() {
    let css = '\
      #menu_work_plus a { background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAZCAMAAADOidZyAAABIFBMVEUxIBo0IRsxHxovHRh0YUYzIBo+LCM2Ix0tGxX///89KyJeTzorGRNsW0JoWD+CblGFclRZSjdJNyqjimOVfVqYgV6PeFZ/a008KiCljWj39vZ5ZUlxX0ZoWUNALSOrkmyoj2qYWig4Jh9mYV9kVDxTQTGfh2NtammfhV9gXFo+Kx6el5WKgH2MdVNsXk9LQDZqZmSZg2KJclBST05BMS2KUyh2SiP7+vrp6OeQhoF+d3VhOx3z8vK8trWimpiTjYuwmHOulXB0aGWDTybv7u3Z1dTSzs17cm5iVFBfVklmRSXc2dipp6aJhYN/gIGBfXiFdGF1ZlM/Q0ZiTjVLPCtdRCrk4uHe29vOysitpqRYSkV4VC11Qh/T19qvqKZXSEQxhG0EAAAFwUlEQVRIx71W13bbMAzlMGUx8p7ximc84sROs1fbjGZ17z3+/y96AYpJ3XP6WtiEeG1SuABIkCL4tywHSytLy+hArwRLwdLy8lKwAhj8BRxanPDnfCGU1loIKZOkhBA6lfIgiPJRJp2BpJuZAT1b6UyUzweJ/yIBCGSa1Vy2Wq1ms40GFDrV5gAECvmokFhNJpM9JSSoGlLcTSYXAESyirXQTgPq0Bg4b4zSSmI0Hkpo9NVqohDlC4klEQzeZLc2NrY2KpUNtPKDXLo1a6bfBYlI9PKrHCYFU5gWhpjKwTQLwFBIQy3AEcQEfnUaELZJNNO9Z028V/M9GSV6IkhXtyqlUnk4Lg9rxWFje/Jy+irTHICAjgoC6aOkGc6iAlJh+CeAsGEhFUSQOA0UGzcK/8b8PWuNEYVIRYkVEMhWysVOu1bslN/cbm8fvZjc3raIQGG1Fyka6SiDv9IeehBDQ+6RTTLkNCC5Tw2DdeyCJ448iKi3WnAESsXO6VmnNutvTvpH/e3NF69azQwWIcwrE4ZK0gyQj4mIRaBTcA1J8mNCpxnCekgEvAueOPHFM+JF2KqWiu3Ts9xkNOpPDrffbr/NtxoNECgknQGyJSQtI7KEUDM4sDtandgTKef2ABaEiMcIYy00Qc2CHClPzxNXiiOHRUgReFA7axdno83Nfn+z/zbfzOaqDaRAarIlTVIK4o4uBVEaBx7ac/3LWvvVnNuHFFg/RglroQG1YdHIo6fnvdCIK2SNF2GuBAK1+Ww0AoFZq7ExHFaIgAgxNuarPZmkB4f2UXLdnth1ObWHkoIajxHKWmihEYB6HQR4Rcb0vBcgwwTiRVg8K08m+dfXm6NRq1kZt2ulLFIgRVzBQpVSngz9yODGXiEKU/tQfLY3Rjx6cvAYf1r78LNECo7s1OjQEVAG2y+m573QYfKOQCubnt32j6aPZ6+v+++Pn5Zq7RqKQZCAQaIuQsoCxlNjbxgE+/Xkk/2d/QNRt0vysV1ft+sGzp/vYA3c7H9RCrbr9ZSTUDkXvBdGSUrKWmIZBPIvH29Pnj+fzJuvj4+P99LD9rBMBGQqFJQ3AbaGbJM2yKcDl/baXokre26fKf3R7gT2E0UgUIjAk2ewd2hZDkEX4lzwXoQC4tfAfPbi+dFoTmfCRXfvuFsdjreqSIFxOZVKhikej2ZotzvwxV7aqXpkr+xPIfetkLYuYVuiA7kRgiMAJVkca++F4qbXaBvi5Jn+GL0fNCrZQf579+LpxVYpS4uQtytZw1bm+QoCLB24hpm+OId+xRHYsc/C0NqQ1NH+pdDo1euYCz8wgVl7L7ghC2u0DVuN+ZuX81a23KmVthofdnf3drNbVAcEou83lytgYQqilANzmO6pHdqJUk15DVAKMBrqEXaGjwC9RMQueC/QqCatuTrQyOdbVA5r41K59O5id6+bIALS1zZ6BZdw8OepDpzYS4BPti60SNIuEFQClFZQvYOTAryk2q/JBXSYNXvhJU5BOlfZqFZxHhTH43GxM3y32/2++y3ylRCVw5AWPgNKLwBakgzdHhdeAxoSPi8BHWvvBRpXQiLQzFUgsF+stduddrv0odvd2/3mzwIKP60ZxaHQCnoB0HZTfBr5n1nfV2L8zSWQWd8RV/4s4EJUguc1nEinp+12e8wMLu5OQ8ljnWAuPguALPu30mZX2mlAPgqh0PX0PHGh3WnIi5CP49oQEeh0aiAyLD0FA38fcPPpMMerIfAfSV0AHHSIRMEJUyHGOw0IMcbzvSeOvrsP8JUMOSg/eFDGpYQe0KUcGPgbEfnGwlP5JQj6AoBpFxgeS9lwGhADwd2re9bG34hW4jthDgcg6Y1cFjobHXf9nXCJBddgqOCuvwCWGTlF0GuChkXHHnjWIHp/J4wi3IrTmcGAdLpJn1b0PvhPt2IQ+JckuXizSNfu8V/AI2pe/oScAeSICyGXVCnxTRL4DV1Miz059fSsAAAAAElFTkSuQmCC"); cursor: pointer; } \
      #window_' + WorkPlus.windowName + '_content { overflow-y: auto; } \
      #window_' + WorkPlus.windowName + '_title span { display: inline-block !important; } \
      #window_' + WorkPlus.windowName + '_buttons { display: inline-block; position: absolute; top: 6px; left: 210px; } \
      #joblist .job td { vertical-align: top; } \
      .jobname { width: 89px; overflow: hidden; display: inline-block; text-overflow: ellipsis; white-space: nowrap; font-weight: bold; text-align: center; } \
      .jobname span { display: block; text-overflow: ellipsis; overflow: hidden; } \
      .sort { text-align: center; } \
      .sort span { cursor: pointer; } \
      .sort *:not(label) { margin: 0 2px; vertical-align: middle; } \
      .outfit { display: none; } \
      .outfit.displayed { display: initial; } \
      .outfit .bag_item { width: 50px; height: 50px; background-size: contain; cursor: pointer; } \
      .outfit .bag_item:hover { opacity: 0.8; } \
      .outfit img { width: 50px; height: 50px; } \
      .outfit .bag_item.equipped { opacity: 0.4; } \
      .job.impossible .jobname { color: #d21010; } \
      .job.with_clothes .jobname { color: #cc9109; } \
      .job.possible .jobname { color: #078a07; } \
    ';
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);
  },

  addMenuButton: function() {
    let button = document.createElement('li');
    button.id = 'menu_work_plus';
    let buttonLink = document.createElement('a');
    buttonLink.addEventListener('click', function() {
      AjaxWindow.show('inventory');
      Bag.getInstance().items = {};
      let val = setInterval(function() {
        if (Object.keys(Bag.getInstance().items).length !== 0 && Wear.wear) {
          clearInterval(val);
          AjaxWindow.close('inventory');
          let items = WorkPlus.getItemList();
          WorkPlus.jobs.forEach(function(job) {
            job.outfit = WorkPlus.calculateBestClothes(job, items);
          });

          WorkPlus.getNearestJobs();

          WorkPlus.openWindow(WorkPlus.windowName, function() {
              let winContent = $('window_' + WorkPlus.windowName + '_content');
              WorkPlus.clear(winContent);
              winContent.appendChild(WorkPlus.getJobList());
          });
        }
      }, 250);
    });
    button.appendChild(buttonLink);
    let workMenu = document.getElementById('menu_work');
    workMenu.parentNode.insertBefore(button, workMenu.nextSibling);
  },

  openWindow: function(name, cb) {
    if (!AjaxWindow.windows[name]) {
      let win = new Element('div', {
        'id': 'window_' + name,
        'class': 'window'
      });

      AjaxWindow.windows[name] = win;

      let html = '\
        <div class="window_borders"> \
        <div id="window_' + name + '_title" class="window_title"></div> \
        <a href="javascript:AjaxWindow.closeAll();" class="window_closeall"></a><a href="javascript:AjaxWindow.toggleSize(\'' + name + '\');" class="window_minimize"></a><a href="javascript:AjaxWindow.close(\'' + name + '\');" class="window_close"></a> \
        <div id="window_' + name + '_buttons"></div> \
        <div id="window_' + name + '_content" class="window_content"></div> \
        </div> \
      ';
      win.setHTML(html);
      win.bringToTop();
      win.injectInside('windows');
      win.centerLeft();

      let winButtons = $('window_' + name + '_buttons');
      winButtons.appendChild(WorkPlus.getSortButtons());

      let winTitle = $('window_' + name + '_title');
      winTitle.addEvent('dblclick', function () {
        win.centerLeft();
        win.setStyle('top', 133);
      });
      win.makeDraggable({
        handle: winTitle,
        onStart: function () {
        },
        onComplete: function () {
        }.bind(AjaxWindow)
      });
      win.addEvent('mousedown', win.bringToTop.bind(win, []));
      winTitle.addEvent('mousedown', win.bringToTop.bind(win, []));
    } else {
      AjaxWindow.maximize(name);
      AjaxWindow.windows[name].bringToTop();
    }

    cb();
  },

  startJob: function(job, duration) {
    new Ajax('game.php?window=job&action=start_job&h=' + h, {
      method: 'post',
      data: {
        x: job.x,
        y: job.y,
        duration: duration
      },
      onComplete: function(data) {
        data = Json.evaluate(data);
        Tasks.replace_all(data.task_queue);
        if (data.error) new HumanMessage(data.error);
        Character.set_energy(data.energy);
      }
    }).request();
  },

  getNearestJobs: function() {
    WorkPlus.nearestJobs = [];
    WMap.mapData.jobs.each(function(job) {
      let wayTime = WMap.calcWayTime(Tasks.last_pos, job);
      if (WorkPlus.nearestJobs[job.job_id] && wayTime > WorkPlus.nearestJobs[job.job_id].way_time) return;
      WorkPlus.nearestJobs[job.job_id] = {x: job.x, y: job.y, way_time: wayTime};
    });
  },

  getSortButtons: function() {
    let sortrow = document.createElement('div');
    sortrow.className = 'sort';
    let jobDuration = document.createElement('select');
    jobDuration.id = 'job_duration';
    jobDuration.innerHTML = '<option value=10 ' + (WorkPlus.sort.duration === 10 ? 'selected' : '') + '>10 minutes</option><option value=30 ' + (WorkPlus.sort.duration === 30 ? 'selected' : '') + '>30 minutes</option><option value=60 ' + (WorkPlus.sort.duration === 60 ? 'selected' : '') + '>1 hour</option><option value=120 ' + (WorkPlus.sort.duration === 120 ? 'selected' : '') + '>2 hours</option>';
    jobDuration.addEventListener('change', function(e) {
      WorkPlus.sort.duration = this.value;
      WorkPlus.reOrderJobs();
    });
    sortrow.appendChild(jobDuration);
    let xpButton = document.createElement('span');
    xpButton.innerHTML = '<img src="images/job/experience.png" alt="Experience">';
    xpButton.addEventListener('click', function () {
      WorkPlus.reOrderJobs('experience');
    });
    sortrow.appendChild(xpButton);
    let moneyButton = document.createElement('span');
    moneyButton.innerHTML = '<img src="images/job/dollar.png" alt="Experience">';
    moneyButton.addEventListener('click', function () {
      WorkPlus.reOrderJobs('money');
    });
    sortrow.appendChild(moneyButton);
    let luckButton = document.createElement('span');
    luckButton.innerHTML = '<img src="images/job/luck.png" alt="Experience">';
    luckButton.addEventListener('click', function () {
      WorkPlus.reOrderJobs('luck');
    });
    sortrow.appendChild(luckButton);
    let availableJobs = document.createElement('input');
    availableJobs.type = 'checkbox';
    availableJobs.id = 'available_jobs';
    availableJobs.checked = WorkPlus.sort.available;
    availableJobs.addEventListener('change', function (e) {
      WorkPlus.sort.available = this.checked;
      WorkPlus.reOrderJobs();
    });
    let availableJobsLabel = document.createElement('label');
    availableJobsLabel.setAttribute('for', 'available_jobs');
    availableJobsLabel.innerHTML = 'Available jobs only';
    sortrow.appendChild(availableJobs);
    sortrow.appendChild(availableJobsLabel);
    return sortrow;
  },

  reOrderJobs: function(method) {
    if (typeof(method) === 'undefined') {
      $('window_' + WorkPlus.windowName + '_content').replaceChild(WorkPlus.getJobList(), $('joblist'));
      return;
    }
    if (WorkPlus.sort.method === method) {
      WorkPlus.sort.direction = WorkPlus.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      WorkPlus.sort.method = method;
      WorkPlus.sort.direction = 'desc';
    }
    WorkPlus.sortJobs(WorkPlus.sort.method, WorkPlus.sort.direction);
    $('window_' + WorkPlus.windowName + '_content').replaceChild(WorkPlus.getJobList(), $('joblist'));
  },

  getJobList: function() {
    let winContent = document.createElement('table');
    winContent.id = 'joblist';
    for (let job in WorkPlus.jobs) {
      if (!WorkPlus.jobs.hasOwnProperty(job)) continue;
      let jobRow = document.createElement('tr');
      jobRow.className = 'job';
      let jobRowHtml = '';
      let current = WorkPlus.jobs[job];
      let nearestJob = WorkPlus.nearestJobs[current.id];
      let nearestJobOnClick = (nearestJob) ? ' onclick="javascript:AjaxWindow.show(\'job\',{x:' + nearestJob.x + ',y:' + nearestJob.y + '});" style="cursor:pointer;"' : '';

      let charskills = typeof(current.outfit) !== 'undefined' ? WorkPlus.mergeSkills(Character.get_skills(), WorkPlus.getAllBonuses(current.outfit.items)) : Character.bonus_skills;
      let currentskills = Character.bonus_skills;

      let xp = WorkPlus.calculateExperience(current, WorkPlus.sort.duration);
      jobRowHtml += '<td class="jobname"'+ nearestJobOnClick +'><img src="/images/jobs/' + current.short + '.png">';
      jobRowHtml += '<span>' + current.name + '</span></td>';
      jobRowHtml += '<td><table class="rewards"><tr><td><img src="images/job/dollar' + (PremiumBoni.hasBonus('money') ? '_bonus' : '') + '.png" alt="Money"></td><td>' + Math.round(current.values.money * 100) + '%</td><td><img src="images/job/luck' + (PremiumBoni.hasBonus('money') ? '_bonus' : '') + '.png" alt="Luck"></td><td>' + Math.round(current.values.luck * 100) + '%</td></tr>';
      jobRowHtml += '<tr><td><img src="images/job/danger.png" alt="Danger"></td><td>' + Math.round(current.values.danger * 100) + '%</td><td><img src="images/job/motivation.png" alt="Motivation"></td><td>' + Math.round(typeof(current.values.motivation) == 'undefined' ? 100 : current.values.motivation * 100) + '%</td></tr>';
      jobRowHtml += '<tr><td><img src="images/job/experience.png" alt="Experience"></td><td colspan=3>' + Math.round(xp.min) + ' - ' + Math.round(xp.max) + '</td></tr></table></td><td><table><tr><td>';
      let skillTotal = 0;
      let currentTotal = 0;
      for (let skill = 0; skill < current.skills.length; skill++) {
        skillTotal += charskills[current.skills[skill]];
        currentTotal += currentskills[current.skills[skill]];
        jobRowHtml += '<img src=\'img.php?type=skill_box&subtype=' + current.skills[skill] + ':normal:normal&value=' + charskills[current.skills[skill]] + '\' alt=\'\'>';
      }
      jobRowHtml += '<img src="img.php?type=task_points&amp;subtype=plus&amp;value=' + skillTotal + '" alt="' + skillTotal + '">';
      jobRowHtml += '<img src="img.php?type=task_points&amp;subtype=minus&amp;value=' + current.difficulty + '" alt="' + current.difficulty + '">';
      let laborPoints = skillTotal - current.difficulty;
      jobRowHtml += '<img src="img.php?type=task_points&amp;subtype=equal&amp;value=' + laborPoints + '" alt="' + laborPoints + '"></td>';
      jobRowHtml += '</tr><tr><td><div class="outfit displayed"></div><div class="start-job" style="text-align:center;margin-top:3px;"></div></td></tr></table></td>';
      jobRow.innerHTML = jobRowHtml;

      if (currentTotal - current.difficulty > 0) {
        jobRow.classList.add('possible');
      } else {
        if (laborPoints > 0) jobRow.classList.add('with_clothes');
        else jobRow.classList.add('impossible');
      }

      if (nearestJob && laborPoints > 0) {
        let distance = document.createElement('div');
        distance.innerHTML = 'Distance: ' + nearestJob.way_time.formatDuration();
        jobRow.querySelector('.start-job').appendChild(distance);

        let startJobButton = document.createElement('img');
        startJobButton.src = 'img.php?type=button&subtype=normal&value=ok';
        startJobButton.style.cursor = 'pointer';
        startJobButton.style.marginTop = '3px';
        startJobButton.addEventListener('click', function() {
          WorkPlus.startJob(nearestJob, WorkPlus.sort.duration * 60);
        }, false);
        jobRow.querySelector('.start-job').appendChild(startJobButton);
      }

      if (!(laborPoints < 1 && WorkPlus.sort.available)) {
        if (typeof(current.outfit) !== 'undefined') {
          WorkPlus.getItemDisplay(current).forEach(function (item) {
            jobRow.querySelector('.outfit').appendChild(item);
          });
        }

        winContent.appendChild(jobRow);
      }
    }
    return winContent;
  },

  mergeSkills: function(a, b) {
    let merge = {};
    Object.assign(merge, a);
    for (let skill in b) {
      if (!b.hasOwnProperty(skill)) continue;
      if (merge.hasOwnProperty(skill)) merge[skill] += b[skill];
      else merge[skill] = b[skill];
    }

    return merge;
  },

  getItemDisplay: function(job) {
      let itemlist = [];
      for (item in job.outfit.items) {
        if (item === 'yield' || !job.outfit.items[item].hasOwnProperty('obj')) continue;

        let currentItem = job.outfit.items[item];
        let element = document.createElement('div');
        element.classList.add('bag_item', 'item_' + currentItem.obj.item_id);

        if (WorkPlus.isEquipped(currentItem.obj.item_id)) {
          element.classList.add('equipped');
        } else {
          element.addEventListener('click', function (e) {
            WorkPlus.equipItem(this, currentItem);
          });
        }

        let image = document.createElement('img');
        image.src = currentItem.obj.image_mini;
        image.alt = currentItem.obj.name;

        element.appendChild(image);
        itemlist.push(element);
      }
      return itemlist;
  },

  equipItem: function(e, item) {
    if (e.classList.contains('equipped')) return;

    document.querySelectorAll('.item_' + item.obj.item_id).forEach(function(e) {
      e.classList.add('equipped');
    });

    let invId = item.obj.inv_id;

    new Ajax('game.php?window=inventory&action=carry&h=' + h, {
      method: 'post',
      data: {
        inv_id: invId
      },
      onComplete: function(data) {
        data = Json.evaluate(data);
        Inventory.change = false;
        Character.bonus = data.bonus;
        Character.set_speed(data.speed);
        if (data.error) {
          new HumanMessage(data.message);
          return false;
        }
        WEvent.trigger('inventory_remove', [invId]);
        if (item.get_type() === 'right_arm') WEvent.trigger('character_weapon_changed', [data.weapon]);
        if (data.old_item) {
          Wear.remove(data.old_item.type);
          data.old_item.next = data.next;
          WEvent.trigger('inventory_add', [data.old_item, true]);
        }
        Wear.add(data.item);
        WEvent.trigger('character_values_changed', []);
        return true;
      }.bind(Bag.getInstance())
    }).request();
  },

  calculateExperience: function(job, duration) {
    let average = 50 * job.values.experience * (duration / 30);
    return {
      'min': 0.5 * average,
      'max': 1.5 * average,
      'average': average
    };
  },

  sortJobs: function(method, direction) {
    WorkPlus.jobs.sort(function (a, b) {
      if (method === 'experience') {
        return (WorkPlus.calculateExperience(a, 120).average - WorkPlus.calculateExperience(b, 120).average) * (direction === 'asc' ? 1 : -1);
      }
      return (a.values[method] - b.values[method]) * (direction === 'asc' ? 1 : -1);
    });
    return WorkPlus.jobs;
  },

  isEquipped: function(itemid) {
    if (Object.keys(Wear.wear).length === 0) return false;

    for (let item in Wear.wear) {
      if (Wear.wear.hasOwnProperty(item) && Wear.wear[item].obj.item_id === itemid) return true;
    }
    return false;
  },

  getAllBonuses: function(outfit) {
    let totalbonuses = {};
    for (let item in outfit) {
      if (!outfit.hasOwnProperty(item) || !outfit[item].hasOwnProperty('obj') || Object.keys(outfit[item].obj.bonus.skills).length === 0) continue;

      for (let skill in outfit[item].obj.bonus.skills) {
        if (!outfit[item].obj.bonus.skills.hasOwnProperty(skill)) continue;
        if (!totalbonuses.hasOwnProperty(skill)) totalbonuses[skill] = outfit[item].obj.bonus.skills[skill];
        else totalbonuses[skill] += outfit[item].obj.bonus.skills[skill];
      }
    }

    return totalbonuses;
  },

  getItemList: function() {
    let wear = Wear.wear;
    let inventory = Bag.getInstance().items;

    if (Object.keys(wear).length !== 0) {
      for (let item in wear) {
        if (wear.hasOwnProperty(item)) inventory[item] = wear[item];
      }
    }

    let uniqueInventory = {
      animal: [],
      body: [],
      foot: [],
      head: [],
      neck: [],
      right_arm: [],
      yield: []
    };

    let attributes = {
      strength: ['punch', 'tough', 'build', 'endurance', 'health'],
      flexibility: ['ride', 'reflex', 'dodge', 'hide', 'swim'],
      dexterity: ['aim', 'shot', 'pitfall', 'finger_dexterity', 'repair'],
      charisma: ['leadership', 'tactic', 'trade', 'animal', 'appearance']
    };

    for (let item in inventory) {
      let duplicate = false;
      if (!inventory.hasOwnProperty(item)) continue;
      for (let unique in uniqueInventory[inventory[item].obj.type]) {
        if (!uniqueInventory[inventory[item].obj.type].hasOwnProperty(unique)) continue;
        if (inventory[item].obj.item_id === uniqueInventory[inventory[item].obj.type][unique].obj.item_id) duplicate = true;
      }
      if (!duplicate && inventory[item].obj.level !== null && inventory[item].obj.level <= Character.level && (Object.keys(inventory[item].obj.bonus.attributes).length !== 0 || Object.keys(inventory[item].obj.bonus.skills).length !== 0 || inventory[item].obj.hasOwnProperty("damage") || inventory[item].obj.hasOwnProperty("speed"))) {
        uniqueInventory[inventory[item].obj.type].push(inventory[item]);
      }
    }

    for (let category in uniqueInventory) {
      if (!uniqueInventory.hasOwnProperty(category)) continue;

      uniqueInventory[category].forEach(function(item) {
        if (Object.keys(item.obj.bonus.attributes) !== 0) {
          for (let attribute in item.obj.bonus.attributes) {
            if (!item.obj.bonus.attributes.hasOwnProperty(attribute)) continue;

            for (let skill in attributes[attribute]) {
              if (!attributes[attribute].hasOwnProperty(skill)) continue;
              if (!item.obj.bonus.skills.hasOwnProperty(attributes[attribute][skill])) item.obj.bonus.skills[attributes[attribute][skill]] = item.obj.bonus.attributes[attribute];
              else item.obj.bonus.skills[attributes[attribute][skill]] += item.obj.bonus.attributes[attribute];
            }
          }
        }
      });
    }
    return uniqueInventory;
  },

  calculateBestClothes: function(job, items) {
    let bestclothes = {
      items: {
        animal: {},
        body: {},
        foot: {},
        head: {},
        neck: {},
        right_arm: {},
        yield: {}
      },
      points: 0
    };

    if (Object.keys(items).length === 0) return bestclothes;

    for (let category in items) {
      if (!items.hasOwnProperty(category)) continue;

      items[category].forEach(function(item) {
        if (WorkPlus.calculateJobBonus(job, item) > WorkPlus.calculateJobBonus(job, bestclothes.items[item.obj.type])) {
            bestclothes.items[item.obj.type] = item;
        } else if (item.obj.hasOwnProperty("damage") && WorkPlus.calculateJobBonus(job, bestclothes.items[item.obj.type]) === 0) {
            if (!bestclothes.items[item.obj.type].hasOwnProperty("obj") || ((item.obj.damage.damage_max + item.obj.damage.damage_min) / 2 > (bestclothes.items[item.obj.type].obj.damage.damage_max + bestclothes.items[item.obj.type].obj.damage.damage_min) / 2)) {
              bestclothes.items[item.obj.type] = item;
            }
        } else if (item.obj.hasOwnProperty("speed") && WorkPlus.calculateJobBonus(job, bestclothes.items[item.obj.type]) === 0) {
            if (!bestclothes.items[item.obj.type].hasOwnProperty("obj") || item.obj.speed > bestclothes.items[item.obj.type].obj.speed) {
              bestclothes.items[item.obj.type] = item;
            }
        }
      });
      bestclothes.points += WorkPlus.calculateJobBonus(job, bestclothes.items[category]);
    }
    return bestclothes;
  },

  calculateJobBonus: function(job, item) {
    if (typeof(item) === 'undefined' || !item.hasOwnProperty('obj')) return 0;

    let points = 0;

    for (let skill in job.skills) {
      if (!job.skills.hasOwnProperty(skill)) continue;
      if (item.obj.bonus.skills.hasOwnProperty(job.skills[skill])) points += item.obj.bonus.skills[job.skills[skill]];
    }
    return points;
  },

  clear: function(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  },

  jobs: [{
      skills: [
          'tough',
          'endurance',
          'leadership',
          'animal',
          'animal'
      ],
      difficulty: 1,
      name: 'Tending Pigs',
      short: 'swine',
      id: 1,
      values: {
          experience: 0.01,
          money: 0.03,
          luck: 0,
          danger: 0.01
      }
  }, {
      skills: [
          'build',
          'shot',
          'pitfall',
          'tactic',
          'animal'
      ],
      difficulty: 0,
      name: 'Scare birds off the field',
      short: 'scarecrow',
      id: 2,
      values: {
          experience: 0.04,
          money: 0.01,
          luck: 0.01,
          danger: 0.02
      }
  }, {
      short: 'wanted',
      name: 'Putting up posters',
      difficulty: 0,
      id: 3,
      skills: [
          'endurance',
          'ride',
          'hide',
          'pitfall',
          'finger_dexterity'
      ],
      values: {
          experience: 0.04,
          money: 0.03,
          luck: 0,
          danger: 0.1
      }
  }, {
      short: 'tabacco',
      name: 'Picking tobacco',
      difficulty: 0,
      id: 4,
      skills: [
          'tough',
          'finger_dexterity',
          'finger_dexterity',
          'tactic',
          'trade'
      ],
      values: {
          experience: 0.01,
          money: 0.06,
          luck: 0.02,
          danger: 0.02
      }
  }, {
      short: 'cotton',
      name: 'Picking cotton',
      difficulty: 1,
      id: 5,
      skills: [
          'tough',
          'endurance',
          'finger_dexterity',
          'leadership',
          'trade'
      ],
      values: {
          experience: 0.05,
          money: 0.02,
          luck: 0,
          danger: 0.03
      }
  }, {
      short: 'sugar',
      name: 'Picking sugar cane  ',
      difficulty: 3,
      id: 6,
      skills: [
          'punch',
          'tough',
          'finger_dexterity',
          'repair',
          'trade'
      ],
      values: {
          experience: 0.02,
          money: 0.06,
          luck: 0.03,
          danger: 0.01
      }
  }, {
      short: 'angle',
      name: 'Stream fishing',
      difficulty: 2,
      id: 7,
      skills: [
          'hide',
          'swim',
          'swim',
          'swim',
          'repair'
      ],
      values: {
          experience: 0,
          money: 0.01,
          luck: 0.06,
          danger: 0.02
      }
  }, {
      short: 'cereal',
      name: 'Harvesting fields  ',
      difficulty: 6,
      id: 8,
      skills: [
          'punch',
          'tough',
          'endurance',
          'ride',
          'finger_dexterity'
      ],
      values: {
          experience: 0.06,
          money: 0.01,
          luck: 0,
          danger: 0.04
      }
  }, {
      short: 'berry',
      name: 'Picking berries',
      difficulty: 10,
      id: 9,
      skills: [
          'tough',
          'tough',
          'hide',
          'finger_dexterity',
          'finger_dexterity'
      ],
      values: {
          experience: 0.05,
          money: 0.02,
          luck: 0.02,
          danger: 0.06
      }
  }, {
      short: 'sheeps',
      name: 'Tending sheep',
      difficulty: 8,
      id: 10,
      skills: [
          'tough',
          'endurance',
          'leadership',
          'animal',
          'animal'
      ],
      values: {
          experience: 0.04,
          money: 0.03,
          luck: 0,
          danger: 0.02
      }
  }, {
      short: 'newspaper',
      name: 'Selling newspaper The Western Star',
      difficulty: 12,
      id: 11,
      skills: [
          'ride',
          'ride',
          'trade',
          'trade',
          'appearance'
      ],
      values: {
          experience: 0.01,
          money: 0.06,
          luck: 0.02,
          danger: 0.01
      }
  }, {
      short: 'corn',
      name: 'Picking corn',
      difficulty: 19,
      id: 14,
      skills: [
          'finger_dexterity',
          'tactic',
          'trade',
          'animal',
          'appearance'
      ],
      values: {
          experience: 0.05,
          money: 0.04,
          luck: 0.07,
          danger: 0.05
      }
  }, {
      short: 'beans',
      name: 'Picking beans',
      difficulty: 18,
      id: 15,
      skills: [
          'endurance',
          'finger_dexterity',
          'leadership',
          'tactic',
          'animal'
      ],
      values: {
          experience: 0.07,
          money: 0.07,
          luck: 0.04,
          danger: 0.05
      }
  }, {
      short: 'fort_guard',
      name: 'Guard fort',
      difficulty: 19,
      id: 16,
      skills: [
          'reflex',
          'shot',
          'leadership',
          'appearance',
          'appearance'
      ],
      values: {
          experience: 0.09,
          money: 0.03,
          luck: 0.02,
          danger: 0.07
      }
  }, {
      short: 'tanning',
      name: 'Tanning deer skin',
      difficulty: 21,
      id: 17,
      skills: [
          'tough',
          'endurance',
          'swim',
          'finger_dexterity',
          'trade'
      ],
      values: {
          experience: 0.08,
          money: 0.08,
          luck: 0.03,
          danger: 0.18
      }
  }, {
      short: 'digging',
      name: 'Prospecting',
      difficulty: 25,
      id: 18,
      skills: [
          'tough',
          'reflex',
          'swim',
          'trade',
          'trade'
      ],
      values: {
          experience: 0.02,
          money: 0.1,
          luck: 0.05,
          danger: 0.03
      }
  }, {
      short: 'grave',
      name: 'Digging graves',
      difficulty: 31,
      id: 19,
      skills: [
          'build',
          'punch',
          'tough',
          'endurance',
          'ride'
      ],
      values: {
          experience: 0.05,
          money: 0.12,
          luck: 0.08,
          danger: 0.09
      }
  }, {
      short: 'turkey',
      name: 'Hunting turkey',
      difficulty: 30,
      id: 20,
      skills: [
          'reflex',
          'hide',
          'hide',
          'shot',
          'pitfall'
      ],
      values: {
          experience: 0.13,
          money: 0.03,
          luck: 0.05,
          danger: 0.21
      }
  }, {
      short: 'rail',
      name: 'Laying railroad tracks',
      difficulty: 40,
      id: 21,
      skills: [
          'build',
          'build',
          'endurance',
          'repair',
          'leadership'
      ],
      values: {
          experience: 0.16,
          money: 0.08,
          luck: 0.02,
          danger: 0.1
      }
  }, {
      short: 'cow',
      name: 'Cowboy',
      difficulty: 34,
      id: 22,
      skills: [
          'ride',
          'ride',
          'reflex',
          'tactic',
          'animal'
      ],
      values: {
          experience: 0.17,
          money: 0.03,
          luck: 0,
          danger: 0.11
      }
  }, {
      short: 'fence',
      name: 'Repair fences',
      difficulty: 30,
      id: 23,
      skills: [
          'finger_dexterity',
          'repair',
          'repair',
          'animal',
          'animal'
      ],
      values: {
          experience: 0.11,
          money: 0.07,
          luck: 0.03,
          danger: 0.06
      }
  }, {
      short: 'stone',
      name: 'Stone mining',
      difficulty: 38,
      id: 25,
      skills: [
          'punch',
          'punch',
          'punch',
          'endurance',
          'reflex'
      ],
      values: {
          experience: 0.08,
          money: 0.17,
          luck: 0.02,
          danger: 0.18
      }
  }, {
      short: 'wood',
      name: 'Cutting trees',
      difficulty: 36,
      id: 27,
      skills: [
          'punch',
          'punch',
          'endurance',
          'reflex',
          'appearance'
      ],
      values: {
          experience: 0.05,
          money: 0.18,
          luck: 0.02,
          danger: 0.21
      }
  }, {
      short: 'brand',
      name: 'Branding cattle',
      difficulty: 53,
      id: 29,
      skills: [
          'ride',
          'reflex',
          'pitfall',
          'animal',
          'animal'
      ],
      values: {
          experience: 0.25,
          money: 0.05,
          luck: 0,
          danger: 0.35
      }
  }, {
      short: 'wire',
      name: 'Installing a barbed wire fence',
      difficulty: 47,
      id: 30,
      skills: [
          'build',
          'pitfall',
          'finger_dexterity',
          'finger_dexterity',
          'animal'
      ],
      values: {
          experience: 0.13,
          money: 0.13,
          luck: 0.06,
          danger: 0.05
      }
  }, {
      short: 'gems',
      name: 'Gemstone search',
      difficulty: 57,
      id: 32,
      skills: [
          'swim',
          'swim',
          'finger_dexterity',
          'trade',
          'trade'
      ],
      values: {
          experience: 0.07,
          money: 0.22,
          luck: 0,
          danger: 0.04
      }
  }, {
      short: 'claim',
      name: 'Carving out claims',
      difficulty: 56,
      id: 33,
      skills: [
          'build',
          'endurance',
          'swim',
          'trade',
          'appearance'
      ],
      values: {
          experience: 0.04,
          money: 0.31,
          luck: 0.04,
          danger: 0.29
      }
  }, {
      short: 'chuck_wagon',
      name: 'Repairing a covered wagon',
      difficulty: 68,
      id: 34,
      skills: [
          'ride',
          'repair',
          'repair',
          'leadership',
          'trade'
      ],
      values: {
          experience: 0.19,
          money: 0.05,
          luck: 0.16,
          danger: 0.11
      }
  }, {
      short: 'break_in',
      name: 'Breaking in horses',
      difficulty: 70,
      id: 35,
      skills: [
          'ride',
          'ride',
          'reflex',
          'pitfall',
          'animal'
      ],
      values: {
          experience: 0.31,
          money: 0.11,
          luck: 0,
          danger: 0.52
      }
  }, {
      short: 'trade',
      name: 'Trading',
      difficulty: 62,
      id: 36,
      skills: [
          'pitfall',
          'trade',
          'trade',
          'appearance',
          'appearance'
      ],
      values: {
          experience: 0.03,
          money: 0.09,
          luck: 0.25,
          danger: 0.12
      }
  }, {
      short: 'mast',
      name: 'Setting up telegraph poles',
      difficulty: 83,
      id: 37,
      skills: [
          'build',
          'build',
          'punch',
          'swim',
          'repair'
      ],
      values: {
          experience: 0.23,
          money: 0.21,
          luck: 0.03,
          danger: 0.14
      }
  }, {
      short: 'beaver',
      name: 'Beaver hunt',
      difficulty: 82,
      id: 39,
      skills: [
          'hide',
          'hide',
          'pitfall',
          'pitfall',
          'pitfall'
      ],
      values: {
          experience: 0.17,
          money: 0.2,
          luck: 0.06,
          danger: 0.21
      }
  }, {
      short: 'coal',
      name: 'Coal mining',
      difficulty: 75,
      id: 40,
      skills: [
          'punch',
          'punch',
          'reflex',
          'finger_dexterity',
          'trade'
      ],
      values: {
          experience: 0.14,
          money: 0.3,
          luck: 0,
          danger: 0.23
      }
  }, {
      short: 'fishing',
      name: 'River fishing',
      difficulty: 95,
      id: 42,
      skills: [
          'swim',
          'swim',
          'pitfall',
          'pitfall',
          'leadership'
      ],
      values: {
          experience: 0.23,
          money: 0.06,
          luck: 0.23,
          danger: 0.38
      }
  }, {
      short: 'trainstation',
      name: 'Building railroad station',
      difficulty: 110,
      id: 43,
      skills: [
          'build',
          'build',
          'finger_dexterity',
          'repair',
          'leadership'
      ],
      values: {
          experience: 0.41,
          money: 0.09,
          luck: 0.07,
          danger: 0.15
      }
  }, {
      short: 'windmeel',
      name: 'Building windmills ',
      difficulty: 100,
      id: 44,
      skills: [
          'build',
          'endurance',
          'ride',
          'leadership',
          'tactic'
      ],
      values: {
          experience: 0.3,
          money: 0.23,
          luck: 0.06,
          danger: 0.18
      }
  }, {
      short: 'explore',
      name: 'Exploration',
      difficulty: 108,
      id: 45,
      skills: [
          'endurance',
          'ride',
          'swim',
          'shot',
          'leadership'
      ],
      values: {
          experience: 0.42,
          money: 0.01,
          luck: 0.22,
          danger: 0.37
      }
  }, {
      short: 'float',
      name: 'Rafting wood',
      difficulty: 110,
      id: 46,
      skills: [
          'reflex',
          'swim',
          'swim',
          'swim',
          'tactic'
      ],
      values: {
          experience: 0.37,
          money: 0.2,
          luck: 0,
          danger: 0.52
      }
  }, {
      short: 'bridge',
      name: 'Building a bridge',
      difficulty: 116,
      id: 47,
      skills: [
          'build',
          'endurance',
          'swim',
          'swim',
          'repair'
      ],
      values: {
          experience: 0.33,
          money: 0.17,
          luck: 0.18,
          danger: 0.53
      }
  }, {
      short: 'springe',
      name: 'Catching horses',
      difficulty: 138,
      id: 48,
      skills: [
          'endurance',
          'ride',
          'ride',
          'animal',
          'animal'
      ],
      values: {
          experience: 0.38,
          money: 0.29,
          luck: 0,
          danger: 0.42
      }
  }, {
      short: 'coffin',
      name: 'Building coffins',
      difficulty: 133,
      id: 49,
      skills: [
          'build',
          'reflex',
          'repair',
          'repair',
          'appearance'
      ],
      values: {
          experience: 0.08,
          money: 0.42,
          luck: 0.15,
          danger: 0.2
      }
  }, {
      short: 'dynamite',
      name: 'Transport ammunition',
      difficulty: 136,
      id: 50,
      skills: [
          'ride',
          'reflex',
          'shot',
          'finger_dexterity',
          'appearance'
      ],
      values: {
          experience: 0.12,
          money: 0.23,
          luck: 0.55,
          danger: 0.93
      }
  }, {
      short: 'coyote',
      name: 'Hunt coyotes',
      difficulty: 141,
      id: 51,
      skills: [
          'endurance',
          'endurance',
          'hide',
          'shot',
          'pitfall'
      ],
      values: {
          experience: 0.43,
          money: 0.08,
          luck: 0.26,
          danger: 0.45
      }
  }, {
      short: 'buffalo',
      name: 'Hunting buffalo',
      difficulty: 143,
      id: 52,
      skills: [
          'ride',
          'pitfall',
          'leadership',
          'tactic',
          'animal'
      ],
      values: {
          experience: 0.62,
          money: 0.24,
          luck: 0,
          danger: 0.72
      }
  }, {
      short: 'indians',
      name: 'Trading with indians',
      difficulty: 176,
      id: 54,
      skills: [
          'pitfall',
          'trade',
          'trade',
          'appearance',
          'appearance'
      ],
      values: {
          experience: 0.14,
          money: 0.11,
          luck: 0.57,
          danger: 0.24
      }
  }, {
      short: 'clearing',
      name: 'Clearing the forest',
      difficulty: 166,
      id: 55,
      skills: [
          'punch',
          'punch',
          'reflex',
          'leadership',
          'tactic'
      ],
      values: {
          experience: 0.08,
          money: 0.62,
          luck: 0.09,
          danger: 0.16
      }
  }, {
      short: 'silver',
      name: 'Silver mining',
      difficulty: 179,
      id: 56,
      skills: [
          'punch',
          'tough',
          'repair',
          'trade',
          'trade'
      ],
      values: {
          experience: 0.08,
          money: 0.76,
          luck: 0,
          danger: 0.32
      }
  }, {
      short: 'diligence_guard',
      name: 'Guarding the stage coach',
      difficulty: 186,
      id: 57,
      skills: [
          'ride',
          'shot',
          'repair',
          'leadership',
          'leadership'
      ],
      values: {
          experience: 0.52,
          money: 0.1,
          luck: 0.32,
          danger: 0.43
      }
  }, {
      short: 'wolf',
      name: 'Hunting wolves',
      difficulty: 208,
      id: 58,
      skills: [
          'hide',
          'hide',
          'pitfall',
          'pitfall',
          'animal'
      ],
      values: {
          experience: 0.63,
          money: 0.21,
          luck: 0.15,
          danger: 0.67
      }
  }, {
      short: 'track',
      name: 'Protecting the track of settlers',
      difficulty: 234,
      id: 59,
      skills: [
          'hide',
          'hide',
          'leadership',
          'leadership',
          'tactic'
      ],
      values: {
          experience: 0.6,
          money: 0.1,
          luck: 0.3,
          danger: 0.33
      }
  }, {
      short: 'ox',
      name: 'Stealing Horses',
      difficulty: 220,
      id: 60,
      skills: [
          'reflex',
          'hide',
          'pitfall',
          'pitfall',
          'animal'
      ],
      values: {
          experience: 0.34,
          money: 0.55,
          luck: 0.18,
          danger: 0.43
      }
  }, {
      short: 'guard',
      name: 'Prison guard',
      difficulty: 206,
      id: 61,
      skills: [
          'punch',
          'reflex',
          'shot',
          'appearance',
          'appearance'
      ],
      values: {
          experience: 0.35,
          money: 0.25,
          luck: 0.38,
          danger: 0.04
      }
  }, {
      short: 'bible',
      name: 'Evangelizing',
      difficulty: 232,
      id: 62,
      skills: [
          'tough',
          'ride',
          'trade',
          'appearance',
          'appearance'
      ],
      values: {
          experience: 0.61,
          money: 0.05,
          luck: 0.52,
          danger: 0.77
      }
  }, {
      short: 'ponyexpress',
      name: 'Pony express',
      difficulty: 230,
      id: 63,
      skills: [
          'endurance',
          'ride',
          'ride',
          'shot',
          'animal'
      ],
      values: {
          experience: 0.45,
          money: 0.15,
          luck: 0.51,
          danger: 0.44
      }
  }, {
      short: 'weapons',
      name: 'Selling guns to indians',
      difficulty: 250,
      id: 64,
      skills: [
          'hide',
          'shot',
          'repair',
          'trade',
          'trade'
      ],
      values: {
          experience: 0.45,
          money: 0.15,
          luck: 0.51,
          danger: 0.44
      }
  }, {
      short: 'dead',
      name: 'Grave robber',
      difficulty: 240,
      id: 65,
      skills: [
          'tough',
          'hide',
          'finger_dexterity',
          'finger_dexterity',
          'repair'
      ],
      values: {
          experience: 0.14,
          money: 0.5,
          luck: 0.9,
          danger: 0.24
      }
  }, {
      short: 'grizzly',
      name: 'Hunting grizzly bear',
      difficulty: 250,
      id: 66,
      skills: [
          'hide',
          'shot',
          'pitfall',
          'pitfall',
          'animal'
      ],
      values: {
          experience: 0.78,
          money: 0.12,
          luck: 0.21,
          danger: 0.71
      }
  }, {
      short: 'oil',
      name: 'Drilling for oil',
      difficulty: 252,
      id: 67,
      skills: [
          'build',
          'tough',
          'endurance',
          'leadership',
          'trade'
      ],
      values: {
          experience: 0.12,
          money: 0.83,
          luck: 0.2,
          danger: 0.7
      }
  }, {
      short: 'treasure_hunting',
      name: 'Treasure hunt',
      difficulty: 285,
      id: 68,
      skills: [
          'hide',
          'hide',
          'repair',
          'repair',
          'tactic'
      ],
      values: {
          experience: 0.17,
          money: 0.1,
          luck: 0.83,
          danger: 0.24
      }
  }, {
      short: 'army',
      name: 'Serving in the army',
      difficulty: 266,
      id: 69,
      skills: [
          'endurance',
          'swim',
          'shot',
          'pitfall',
          'appearance'
      ],
      values: {
          experience: 0.72,
          money: 0.55,
          luck: 0,
          danger: 0.35
      }
  }, {
      short: 'steal',
      name: 'Robbing settlers',
      difficulty: 256,
      id: 70,
      skills: [
          'reflex',
          'hide',
          'shot',
          'pitfall',
          'finger_dexterity'
      ],
      values: {
          experience: 0.33,
          money: 0.32,
          luck: 0.74,
          danger: 0.66
      }
  }, {
      short: 'mercenary',
      name: 'Mercenary work',
      difficulty: 291,
      id: 71,
      skills: [
          'tough',
          'swim',
          'shot',
          'repair',
          'appearance'
      ],
      values: {
          experience: 0.52,
          money: 0.96,
          luck: 0,
          danger: 0.85
      }
  }, {
      short: 'bandits',
      name: 'Chasing bandits',
      difficulty: 303,
      id: 72,
      skills: [
          'tough',
          'endurance',
          'hide',
          'leadership',
          'tactic'
      ],
      values: {
          experience: 0.72,
          money: 0.11,
          luck: 0.82,
          danger: 0.83
      }
  }, {
      short: 'aggression',
      name: 'Ambush',
      difficulty: 346,
      id: 73,
      skills: [
          'hide',
          'hide',
          'pitfall',
          'tactic',
          'appearance'
      ],
      values: {
          experience: 0.22,
          money: 0.72,
          luck: 0.71,
          danger: 0.86
      }
  }, {
      short: 'diligence_aggression',
      name: 'Ambush stagecoach',
      difficulty: 446,
      id: 74,
      skills: [
          'shot',
          'pitfall',
          'leadership',
          'tactic',
          'appearance'
      ],
      values: {
          experience: 0.73,
          money: 0.21,
          luck: 0.95,
          danger: 0.67
      }
  }, {
      short: 'bounty',
      name: 'Bounty hunter',
      difficulty: 380,
      id: 75,
      skills: [
          'punch',
          'endurance',
          'shot',
          'pitfall',
          'appearance'
      ],
      values: {
          experience: 0.23,
          money: 0.94,
          luck: 0.79,
          danger: 0.72
      }
  }, {
      short: 'captured',
      name: 'Transporting prisoners',
      difficulty: 388,
      id: 76,
      skills: [
          'endurance',
          'reflex',
          'hide',
          'tactic',
          'tactic'
      ],
      values: {
          experience: 0.69,
          money: 0.07,
          luck: 0.85,
          danger: 0.24
      }
  }, {
      short: 'train',
      name: 'Robbing trains',
      difficulty: 425,
      id: 77,
      skills: [
          'endurance',
          'hide',
          'shot',
          'pitfall',
          'trade'
      ],
      values: {
          experience: 0.87,
          money: 0.67,
          luck: 0.92,
          danger: 0.96
      }
  }, {
      short: 'burglary',
      name: 'Burglary',
      difficulty: 463,
      id: 78,
      skills: [
          'endurance',
          'hide',
          'hide',
          'tactic',
          'trade'
      ],
      values: {
          experience: 0.34,
          money: 0.8,
          luck: 0.81,
          danger: 0.26
      }
  }]
};

WorkPlus.init();