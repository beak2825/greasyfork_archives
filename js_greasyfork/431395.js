// ==UserScript==
// @name         新しい放置ゲームで目標までの放置時間を表示する
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  新しい放置ゲームで目標までの放置時間を表示します
// @author       toomer
// @match        https://dem08656775.github.io/newincrementalgame/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431395/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E7%9B%AE%E6%A8%99%E3%81%BE%E3%81%A7%E3%81%AE%E6%94%BE%E7%BD%AE%E6%99%82%E9%96%93%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431395/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E7%9B%AE%E6%A8%99%E3%81%BE%E3%81%A7%E3%81%AE%E6%94%BE%E7%BD%AE%E6%99%82%E9%96%93%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

// jshint esversion: 6
(() => {
  'use strict';
  const D = (value) => new Decimal(value);
  class NIG {
    constructor() {
      this.player = {
        money: D(document.getElementById('coinamount').textContent.slice(6)),
        level: (() => {
          const contents = document.getElementsByClassName('levelrcontents');
          if (contents.length == 0) return D(0);
          const res = contents[0].textContent.match(/段位: (?<level>[e\d\+\.]+)/);
          return D(res === null ? 0 : res.groups.level);
        })(),
        levelresettime: (() => {
          const contents = document.getElementsByClassName('levelrcontents');
          if (contents.length == 0) return D(0);
          const res = contents[0].textContent.match(/段位リセット: (?<levelresettime>[e\d\+\.]+)/);
          return D(res === null ? 0 : res.groups.levelresettime);
        })(),
        maxlevelgained: (() => {
          const res = document.getElementsByClassName('challenges-container')[0].parentElement.textContent.match(/最大取得段位:(?<maxlevelgained>[e\d\+\.]+)/);
          return D(res === null ? 1 : res.groups.maxlevelgained);
        })(),
        rank: (() => {
          const contents = document.getElementsByClassName('rankrcontents');
          if (contents.length == 0) return D(0);
          const res = contents[0].textContent.match(/階位: (?<rank>[e\d\+\.]+)/);
          return D(res === null ? 0 : res.groups.rank);
        })(),
        rankresettime: (() => {
          const contents = document.getElementsByClassName('rankrcontents');
          if (contents.length == 0) return D(0);
          const res = contents[0].textContent.match(/階位リセット: (?<rankresettime>[e\d\+\.]+)/);
          return D(res === null ? 0 : res.groups.rankresettime);
        })(),

        generators: (() => {
          let generators = new Array(8).fill().map(() => D(0));
          const generatorElements = document.getElementsByClassName('generator');
          for (let i = 0; i < generatorElements.length; i++) {
            const res = generatorElements[i].textContent.match(/発生器(\d)+: (?<n>[e\d\+\.]+)/);
            if (res !== null) generators[i] = D(res.groups.n);
          }
          return generators;
        })(),
        generatorsBought: (() => {
          let generatorsBought = new Array(8).fill().map(() => D(0));
          const generatorElements = document.getElementsByClassName('generator');
          for (let i = 0; i < generatorElements.length; i++) {
            const res = generatorElements[i].textContent.match(/購入数: (?<n>[e\d\+\.]+)/);
            if (res !== null) generatorsBought[i] = D(res.groups.n);
          }
          return generatorsBought;
        })(),
        generatorsCost: (() => {
          let generatorsCost = [D(1), D('1e4'), D('1e9'), D('1e16'), D('1e25'), D('1e36'), D('1e49'), D('1e64')];
          const gbuttons = document.querySelectorAll('.generator > .gbutton');
          for (let i = 0; i < gbuttons.length; i++) {
            const res = gbuttons[i].textContent.match(/購入 コスト: (?<n>[e\d\+\.]+)/);
            generatorsCost[i] = D(res.groups.n);
          }
          return generatorsCost;
        })(),
        generatorsMode: (() => {
          let generatorsMode = new Array(8).fill().map((_, i) => i);
          const generatorElements = document.getElementsByClassName('generator');
          for (let i = 0; i < generatorElements.length; i++) {
            const res = generatorElements[i].textContent.match(/モード: (?<n>\d+)/);
            if (res !== null) generatorsMode[i] = Number(res.groups.n);
          }
          return generatorsMode;
        })(),

        accelerators: (() => {
          let accelerators = new Array(8).fill().map(() => D(0));
          const acceleratorElements = document.getElementsByClassName('accelerator');
          for (let i = 0; i < acceleratorElements.length; i++) {
            const res = acceleratorElements[i].textContent.match(/時間加速器(\d)+: (?<n>[e\d\+\.]+)/);
            if (res !== null) accelerators[i] = D(res.groups.n);
          }
          return accelerators;
        })(),
        acceleratorsBought: (() => {
          let acceleratorsBought = new Array(8).fill().map(() => D(0));
          const acceleratorElements = document.getElementsByClassName('accelerator');
          for (let i = 0; i < acceleratorElements.length; i++) {
            const res = acceleratorElements[i].textContent.match(/購入数: (?<n>[e\d\+\.]+)/);
            if (res !== null) acceleratorsBought[i] = D(res.groups.n);
          }
          return acceleratorsBought;
        })(),
        acceleratorsCost: (() => {
          let acceleratorsCost = [D(10), D('1e10'), D('1e20'), D('1e40'), D('1e80'), D('1e160'), D('1e320'), D('1e640')];
          const abuttons = document.getElementsByClassName('abutton');
          for (let i = 0; i < abuttons.length; i++) {
            const res = abuttons[i].textContent.match(/購入 コスト: (?<n>[e\d\+\.]+)/);
            acceleratorsCost[i] = D(res.groups.n);
          }
          return acceleratorsCost;
        })(),

        darkmoney: D(document.getElementById('darkcoinamount').textContent.slice(7)),
        darkgenerators: (() => {
          let darkgenerators = new Array(8).fill().map(() => D(0));
          const darkgeneratorElements = document.getElementsByClassName('darkgenerator');
          for (let i = 0; i < darkgeneratorElements.length; i++) {
            const res = darkgeneratorElements[i].textContent.match(/裏発生器(\d)+: (?<n>[e\d\+\.]+)/);
            if (res !== null) darkgenerators[i] = D(res.groups.n);
          }
          return darkgenerators;
        })(),
        darkgeneratorsBought: (() => {
          let darkgeneratorsBought = new Array(8).fill().map(() => D(0));
          const darkgeneratorElements = document.getElementsByClassName('darkgenerator');
          for (let i = 0; i < darkgeneratorElements.length; i++) {
            const res = darkgeneratorElements[i].textContent.match(/購入数: (?<n>[e\d\+\.]+)/);
            if (res !== null) darkgeneratorsBought[i] = D(res.groups.n);
          }
          return darkgeneratorsBought;
        })(),
        darkgeneratorsCost: (() => {
          let darkgeneratorsCost = [D('1e100'), D('1e108'), D('1e127'), D('1e164'), D('1e225'), D('1e316'), D('1e423'), D('1e612')];
          const dbuttons = document.querySelectorAll('.darkgenerator > .gbutton');
          for (let i = 0; i < dbuttons.length; i++) {
            const res = dbuttons[i].textContent.match(/購入 コスト: (?<n>[e\d\+\.]+)/);
            darkgeneratorsCost[i] = D(res.groups.n);
          }
          return darkgeneratorsCost;
        })(),

        tickspeed: (() => {
          const res = document.getElementById('tickspeed').textContent.match(/: (?<tickspeed>\d+)/);
          return D(res === null ? 1000 : res.groups.tickspeed);
        })(),

        onchallenge: document.getElementsByClassName('challengeconfigbutton')[8].textContent == ' 挑戦放棄 ',
        challenges: (() => {
          let challenges = new Array(8).fill(false);
          const challengeconfigbutton = document.getElementsByClassName('challengeconfigbutton');
          for (let i = 0; i < 8; i++) {
            challenges[i] = challengeconfigbutton[i].classList.contains('selected');
          }
          return challenges;
        })(),
        challengebonuses: (() => {
          let challengebonuses = new Array(15).fill(false);
          const rewardbuttons = document.getElementsByClassName('rewardbutton');
          for (let i = 0; i < 15; i++) {
            challengebonuses[i] = rewardbuttons[i].classList.contains('selected');
          }
          return challengebonuses;
        })(),
        rankchallengebonuses: (() => {
          let rankchallengebonuses = new Array(15).fill(false);
          const rewardbuttons = document.getElementsByClassName('rewardbutton');
          for (let i = 15; i < 30; i++) {
            rankchallengebonuses[i - 15] = i < rewardbuttons.length && rewardbuttons[i].classList.contains('selected');
          }
          return rankchallengebonuses;
        })(),

        smalltrophies: (() => {
          return Array.from(document.querySelectorAll(".smalltrophy span")).map(s => s.style.display == '');
        })(),

        levelitems: (() => {
          let levelitems = new Array(5).fill(0);
          const levelitemElements = document.getElementsByClassName('levelitem');
          for (let i = 0; i < levelitemElements.length; i++) {
            const res = levelitemElements[i].textContent.match(/取得数: (?<n>\d+)/);
            if (res !== null) levelitems[i] = Number(res.groups.n);
          }
          return levelitems;
        })(),
        levelitembought: (() => {
          let levelitembought = 0;
          const levelshopElements = document.getElementsByClassName('levelshop');
          if (levelshopElements.length > 0) {
            const res = levelshopElements[0].textContent.match(/累計購入回数: (?<n>\d+)/);
            if (res !== null) levelitembought = Number(res.groups.n);
          }
          return levelitembought;
        })(),
      };
      this.commonmult = D(1);
      this.memory = (() => {
        const res = document.getElementsByClassName('worlds')[0].parentElement.textContent.match(/記憶: (?<memory>[e\d\+\.]+)/);
        return res === null ? 0 : Number(res.groups.memory);
      })();
      this.smallmemory = this.player.smalltrophies.reduce((x, y) => x + (y ? 1 : 0), 0);
      this.totalremember = (() => {
        const res = document.getElementsByClassName('worlds')[0].parentElement.textContent.match(/合計思い出: (?<totalremember>[e\d\+\.]+)/);
        return res === null ? 0 : Number(res.groups.totalremember);
      })();
      this.updateTickspeed();
    };

    static softCap(num, cap) {
      if (num.lte(cap)) return num;
      return cap.mul(D(num.div(cap).log2()).add(1)).min(num);
    }
    static strongSoftCap(num, cap) {
      if (num.lte(cap)) return num;
      return cap.mul(D(D(num.div(cap).log2()).add(1).log2()).add(1)).min(num);
    }

    calcCommonMult() {
      let mult = D(1);
      if (!this.isChallengeActive(7))
        mult = mult.mul(NIG.softCap(this.player.levelresettime.add(1), D(100).mul(this.player.levelitems[2] + 1)));

      if (this.isChallengeBonusActive(3)) mult = mult.mul(D(2));
      if (this.isRankChallengeBonusActive(3)) mult = mult.mul(D(3));

      mult = mult.mul(1 + this.smallmemory * 0.01 + this.memory * 0.25);
      if (this.isRankChallengeBonusActive(11))
        mult = mult.mul(D(2).pow(D(this.memory).div(12)));

      if (this.player.onchallenge && this.isRankChallengeBonusActive(4)) {
        let cnt = 0;
        this.player.challenges.forEach(b => cnt += b ? 1 : 0);
        mult = mult.mul(1 + cnt * 0.25);
      }

      if (this.player.darkmoney.gte(1))
        mult = mult.mul(this.player.darkmoney.add(10).log10());

      if (this.isRankChallengeBonusActive(9)) {
        mult = mult.mul(this.multbyac);
        if (this.multbyac.gt(1)) mult = mult.mul(this.multbyac);
      }
      this.commonmult = mult;
    }

    calcIncrementMult(i, to, highest) {
      let mult = this.commonmult;

      if (!this.isChallengeActive(4))
        mult = mult.mul(D(10).pow((i + 1) * (i - to)));

      mult = mult.mul(D(this.player.level.add(2).log2()).pow(i - to));

      if (!this.isChallengeActive(2)) {
        if ((i < highest || this.isChallengeBonusActive(2)) && this.player.generatorsBought[i].gt(0)) {
          let mm = this.player.generatorsBought[i];
          if (this.isChallengeBonusActive(11))
            mm = mm.mul(mm.add(2).log2());
          mult = mult.mul(mm);
        }
      }

      if (i == 0 && this.isChallengeBonusActive(7)) {
        if (this.isRankChallengeBonusActive(7))
          mult = mult.mul(NIG.strongSoftCap(this.player.maxlevelgained, D(100000)));
        else
          mult = mult.mul(this.player.maxlevelgained.min(100000));
      }

      if (this.player.darkgenerators[i].gte(1))
        mult = mult.mul(i + 2 + this.player.darkgenerators[i].log10());

      return mult;
    }

    calcGeneratorExpr() {
      this.calcCommonMult();
      let highest = 0;
      for (let i = 0; i < 8; i++) if (this.player.generators[i].gt(0)) highest = i;
      let g = Array.from(new Array(9), (_, i) => new Array(Math.max(0, highest + 2 - i)).fill(D(0)));
      g[0][0] = this.player.money;
      for (let i = 0; i <= highest; i++) g[i + 1][0] = this.player.generators[i];
      for (let i = highest + 1; i-- > 0;) {
        if (!this.isChallengeBonusActive(13)) {
          const to = this.player.generatorsMode[i];
          let mult = this.calcIncrementMult(i, to, highest);
          g[i + 1].forEach((gg, j) => g[to][j + 1] = g[to][j + 1].add(gg.mul(mult)));
        } else if (this.isChallengeActive(3)) {
          const to = 0;
          let mult = this.calcIncrementMult(i, to, highest).mul(i + 1);
          g[i + 1].forEach((gg, j) => g[to][j + 1] = g[to][j + 1].add(gg.mul(mult)));
        } else {
          for (let to = 0; to <= i; to++) {
            let mult = this.calcIncrementMult(i, to, highest);
            g[i + 1].forEach((gg, j) => g[to][j + 1] = g[to][j + 1].add(gg.mul(mult)));
          }
        }
        while (g[i].length > 0 && g[i][g[i].length - 1].eq(0)) g[i].pop();
      }
      return g;
    }
    calcAcceleratorExpr() {
      let highest = 0;
      for (let i = 1; i < 8; i++) if (this.player.accelerators[i].gt(0)) highest = i;
      let a = Array.from(new Array(8), (_, i) => new Array(Math.max(0, highest + 1 - i)).fill(D(0)));
      for (let i = 0; i <= highest; i++) a[i][0] = this.player.accelerators[i];
      for (let i = highest + 1; i-- > 1;) {
        let mult = D(1);
        if (i == 1 ? this.isChallengeBonusActive(10) : this.isRankChallengeBonusActive(6))
          if (this.isRankChallengeBonusActive(10))
            mult = mult.add(this.player.acceleratorsBought[i].pow_base(2));
          else
            mult = mult.add(this.player.acceleratorsBought[i]);
        a[i].forEach((aa, j) => a[i - 1][j + 1] = a[i - 1][j + 1].add(aa.mul(mult)));
        while (a[i - 1].length > 0 && a[i - 1][a[i - 1].length - 1].eq(0)) a[i - 1].pop();
      }
      return a;
    }
    static calcAfterNtick(expr, n) {
      let p = D(1);
      let res = D(0);
      for (let i = 0; i < expr.length; i++) {
        res = res.add(expr[i].mul(p));
        p = p.mul(n.sub(i)).div(i + 1);
      }
      return res;
    }

    updateTickspeed() {
      const amult = this.isChallengeBonusActive(6) ? (this.isRankChallengeBonusActive(10) ? this.player.acceleratorsBought[0].pow_base(2) : this.player.acceleratorsBought[0].add(1)) : D(1);
      let acnum = this.player.accelerators[0];
      if (this.isRankChallengeBonusActive(13)) {
        for (let i = 1; i < 8; i++) acnum = acnum.mul(this.player.accelerators[i].add(1));
      }
      const challengebonusescount = this.player.challengebonuses.reduce((x, y) => x + (y ? 1 : 0), 0);
      this.player.tickspeed = (1000 - this.player.levelitems[1] * challengebonusescount) / acnum.add(10).mul(amult).log10();
      this.multbyac = D(50).div(this.player.tickspeed);
    }

    isChallengeActive(index) {
      return this.player.onchallenge && this.player.challenges[index];
    }
    isChallengeBonusActive(index) {
      return this.player.challengebonuses[4] || !this.player.onchallenge ? this.player.challengebonuses[index] : false;
    }
    isRankChallengeBonusActive(index) {
      return this.player.rankchallengebonuses[index];
    }
    isGeneratorBuyable(index) {
      if (this.isChallengeActive(6)) if (index == 3 || index == 7) return false;
      // return this.player.money.gte(this.player.generatorsCost[index]);
      return true;
    }
    isAcceleratorBuyable(index) {
      if (this.isChallengeActive(5)) return false;
      if (index >= 1 && this.player.levelresettime.lte(0)) return false;
      if (index >= 2 && this.player.levelitems[3] + 1 < index) return false;
      // return this.player.money.gte(this.player.acceleratorsCost[index]);
      return true;
    }

    resetRankborder() {
      let p = this.isChallengeActive(0) ? 96 : 72;
      p -= this.totalremember * 0.5;
      return D(10).pow(p);
    }

    targetmoney(target) {
      let tmoney = D('Infinity');
      if (target == 'lowest') {
        for (let i = 0; i < this.player.generatorsCost.length; i++) {
          if (this.isGeneratorBuyable(i)) tmoney = tmoney.min(this.player.generatorsCost[i]);
        }
        for (let i = 0; i < this.player.acceleratorsCost.length; i++) {
          if (this.isAcceleratorBuyable(i)) tmoney = tmoney.min(this.player.acceleratorsCost[i]);
        }
        for (let i = 0; i < this.player.darkgeneratorsCost.length; i++) {
          tmoney = tmoney.min(this.player.darkgeneratorsCost[i]);
        }
      } else if (target == 'newgen') {
        for (let i = 0; i < this.player.generatorsCost.length; i++) {
          if (this.player.generators[i].eq(0) && this.isGeneratorBuyable(i)) {
            tmoney = tmoney.min(this.player.generatorsCost[i]);
          }
        }
      } else if (target == 'newacc') {
        for (let i = 0; i < this.player.acceleratorsCost.length; i++) {
          if (this.player.accelerators[i].eq(0) && this.isAcceleratorBuyable(i)) {
            tmoney = tmoney.min(this.player.acceleratorsCost[i]);
          }
        }
      } else if (target == 'newdark') {
        for (let i = 0; i < this.player.darkgeneratorsCost.length; i++) {
          if (this.player.darkgenerators[i].eq(0)) {
            tmoney = tmoney.min(this.player.darkgeneratorsCost[i]);
          }
        }
      } else if (target == 'levelreset') {
        tmoney = D(this.isChallengeActive(0) ? '1e+24' : '1e+18');
      } else if (target == 'rankreset') {
        tmoney = this.resetRankborder();
      } else if (target == 'input') {
        try {
          tmoney = (D(document.getElementById('targetcfg').value)).max(0);
        } catch (e) {
        }
      } else {
        tmoney = D('1e+18');
      }
      return tmoney;
    }

    calcgoalticks(tmoney) {
      if (this.player.money.gte(tmoney)) return D(0);
      if (tmoney.eq(D('Infinity'))) return D('Infinity');
      if (this.player.generators.every(g => g.eq(0))) return D('Infinity');
      const gexpr = this.calcGeneratorExpr();
      let ok = D(2);
      let ng = D(0);
      while (NIG.calcAfterNtick(gexpr[0], ok).lt(tmoney)) {
        ng = ok;
        ok = ok.mul(ok);
      }
      let cnt = 0;
      while (ng.add(1).lt(ok) && cnt < 60) {
        const m = ok.sub(ng).lt(4) ? ok.add(ng).div(2).floor() : ok.mul(ng).sqrt().floor();
        if (NIG.calcAfterNtick(gexpr[0], m).lt(tmoney)) {
          ng = m;
        } else {
          ok = m;
        }
        cnt += 1;
      }
      return ok;
    }

    calcTickfromExpr(aexpr, tick) {
      let acnum = NIG.calcAfterNtick(aexpr[0], tick);
      if (this.isRankChallengeBonusActive(13)) {
        for (let i = 1; i < 8; i++) acnum = acnum.mul(NIG.calcAfterNtick(aexpr[i], tick).add(1));
      }
      return acnum;
    }

    tick2sec(tick) {
      if (tick.lte(0)) return D(0);
      if (tick.eq(D('Infinity'))) return D('Infinity');
      const aexpr = this.calcAcceleratorExpr();
      const delta = D('1e-3');
      const challengebonusescount = this.player.challengebonuses.reduce((x, y) => x + (y ? 1 : 0), 0);
      const basetick = D(1000 - this.player.levelitems[1] * challengebonusescount).div(1000);
      const amult = this.isChallengeBonusActive(6) ? (this.isRankChallengeBonusActive(10) ? this.player.acceleratorsBought[0].pow_base(2) : this.player.acceleratorsBought[0].add(1)) : D(1);
      let curtick = D(0);
      let acnum = this.player.accelerators[0];
      if (this.isRankChallengeBonusActive(13)) {
        for (let i = 1; i < 8; i++) acnum = acnum.mul(this.player.accelerators[i].add(1));
      }
      let prevdt = basetick.div(acnum.add(10).mul(amult).log10());
      let sec = D(0);
      while (curtick.lt(tick)) {
        const prevtick = curtick;
        let ok = curtick.add(1);
        let ng = tick.add(1);
        let cnt = 0;
        while (ok.add(1).lt(ng) && cnt < 60) {
          const m = ng.sub(ok).lt(4) ? ok.add(ng).div(2).floor() : ok.mul(ng).sqrt().floor();
          if (D(1).div(this.calcTickfromExpr(aexpr, m).add(10).mul(amult).log10()).add(delta).gt(prevdt)) {
            ok = m;
          } else {
            ng = m;
          }
          cnt += 1;
        }
        curtick = ok;
        if (prevtick.eq(curtick)) break;
        const dt = D(1).div(this.calcTickfromExpr(aexpr, curtick).add(10).mul(amult).log10());
        sec = sec.add(prevdt.add(dt).div(2).mul(curtick.sub(prevtick)));
        prevdt = dt;
      }
      return sec.mul(basetick);
    }

    calctickandsec(tmoney) {
      if (this.player.money.gte(tmoney)) return { ticks: D(0), sec: D(0) };
      if (tmoney.eq(D('Infinity'))) return { ticks: D('Infinity'), sec: D('Infinity') };
      if (this.isRankChallengeBonusActive(9)) {
        const previnfo = {
          tickspeed: this.player.tickspeed,
          multbyac: this.multbyac,
        };
        const aexpr = this.calcAcceleratorExpr();
        const challengebonusescount = this.player.challengebonuses.reduce((x, y) => x + (y ? 1 : 0), 0);
        const basetick = D(1000 - this.player.levelitems[1] * challengebonusescount);
        const amult = this.isChallengeBonusActive(6) ? (this.isRankChallengeBonusActive(10) ? this.player.acceleratorsBought[0].pow_base(2) : this.player.acceleratorsBought[0].add(1)) : D(1);
        let curtick = D(0);
        let acnum = this.player.accelerators[0];
        if (this.isRankChallengeBonusActive(13)) {
          for (let i = 1; i < 8; i++) acnum = acnum.mul(this.player.accelerators[i].add(1));
        }
        const basemu9 = D(50).div(1000 - this.player.levelitems[1] * challengebonusescount);
        let prevmu9 = basemu9.mul(acnum.add(10).mul(amult).log10());
        let prevmu9mul = prevmu9.mul(prevmu9.max(1));
        let highesta = 0;
        for (let i = 0; i < 8; i++) if (this.player.accelerators[i].gt(0)) highesta = i;

        while (this.player.money.lt(tmoney)) {
          const delta = prevmu9.lt('0.2') ? D('1e-2') : prevmu9.lt('2') ? D('1e-1') : prevmu9.lt('20') ? D('1') : D('10');

          let ok = curtick.add(1);
          let ng = curtick.add(2);
          let cnt = 0;
          if (highesta > 0) {
            let curmu9 = basemu9.mul(this.calcTickfromExpr(aexpr, ng).add(10).mul(amult).log10());
            while (curmu9.mul(curmu9.max(1)).lt(prevmu9mul.add(delta))) {
              ng = ng.mul(ng);
              curmu9 = basemu9.mul(this.calcTickfromExpr(aexpr, ng).add(10).mul(amult).log10());
            }
            while (ok.add(1).lt(ng) && cnt < 60) {
              const m = ng.sub(ok).lt(4) ? ok.add(ng).div(2).floor() : ok.mul(ng).sqrt().floor();
              curmu9 = basemu9.mul(this.calcTickfromExpr(aexpr, m).add(10).mul(amult).log10());
              if (curmu9.mul(curmu9.max(1)).lt(prevmu9mul.add(delta))) {
                ok = m;
              } else {
                ng = m;
              }
              cnt += 1;
            }
          }

          const gexpr = this.calcGeneratorExpr();
          if (highesta === 0) {
            ok = curtick.add(2);
            while (NIG.calcAfterNtick(gexpr[0], ok.sub(curtick)).lt(tmoney)) {
              ok = ok.mul(ok);
            }
          }

          if (NIG.calcAfterNtick(gexpr[0], ok.sub(curtick)).gte(tmoney)) {
            ng = curtick.add(1);
            cnt = 0;
            while (ng.add(1).lt(ok) && cnt < 60) {
              const m = ok.sub(ng).lt(4) ? ok.add(ng).div(2).floor() : ok.mul(ng).sqrt().floor();
              if (NIG.calcAfterNtick(gexpr[0], m.sub(curtick)).lt(tmoney)) {
                ng = m;
              } else {
                ok = m;
              }
              cnt += 1;
            }
          }
          const tick = ok.sub(curtick);
          this.player.money = NIG.calcAfterNtick(gexpr[0], tick);
          for (let i = 0; i < 8; i++) this.player.generators[i] = NIG.calcAfterNtick(gexpr[i + 1], tick);
          const tsnum = this.calcTickfromExpr(aexpr, ok).add(10).mul(amult).log10();
          this.player.tickspeed = basetick.div(tsnum);
          this.multbyac = D(50).div(this.player.tickspeed);
          prevmu9 = basemu9.mul(tsnum);
          prevmu9mul = prevmu9.mul(prevmu9.max(1));
          curtick = ok;
        }
        const sec = curtick.mul(0.05);
        this.player.tickspeed = previnfo.tickspeed;
        this.multbyac = previnfo.multbyac;
        return { ticks: curtick, sec: sec };
      } else {
        const ticks = this.calcgoalticks(tmoney);
        const sec = this.tick2sec(ticks);
        return { ticks: ticks, sec: sec };
      }
    }
  }

  let prevupdtime = 0;
  let prev = null;
  let tickspeed = D(1000);
  const update = (force, repeat) => {
    if (force || (Date.now() - prevupdtime >= 300)) {
      let nig = new NIG();

      const sel = document.getElementById('targetSelector');
      const tmoney = nig.targetmoney(sel.options[sel.selectedIndex].value);
      const res = nig.calctickandsec(tmoney);
      const goalticks = res.ticks;
      const goalsec = res.sec;

      tickspeed = nig.player.tickspeed;
      prevupdtime = Date.now();
      prev = {
        tmoney: tmoney,
        goalticks: goalticks,
        goalsec: goalsec,
      };
    }
    if (prev !== null) {
      const updategoal = () => {
        const elapsed = Date.now() - prevupdtime;
        const goalticks = prev.goalticks.sub(D(elapsed).div(tickspeed).floor()).max(0);
        const goalsec = prev.goalsec.sub(elapsed / 1000).max(0);
        let goalstr = prev.tmoney.toExponential(3) + ' ポイントまで ' + goalticks.toExponential(3) + ' ticks';
        goalstr += ' (' + goalsec.toExponential(3) + ' sec)';
        goalstr += ' ' + (new Date(Date.now() + Number(goalsec.mul(1000).toExponential(20)))).toLocaleString() + ' に達成';
        document.getElementById('targetmoney').textContent = goalstr;
      };
      updategoal();
    }

    if (repeat) {
      setTimeout(() => update(false, repeat), 50);
    }
  };

  const divstr = `
  <div id="calculator">
    <div>
      <select id="targetSelector">
        <option value="lowest">最低コスト</option>
        <option value="newgen">新しい発生器</option>
        <option value="newacc">新しい時間加速器</option>
        <option value="newdark">新しい裏発生器</option>
        <option value="levelreset">段位リセット</option>
        <option value="rankreset">階位リセット</option>
        <option value="input">入力</option>
      </select>
      <input type="text" id="targetcfg" value="1e18" size=10 style="visibility:hidden;">
    </div>
    <div id="targetmoney"></div>
  </div>`;
  document.getElementsByClassName('container')[0].insertAdjacentHTML('beforeend', divstr);
  document.getElementById('targetSelector').addEventListener('change', () => {
    const sel = document.getElementById('targetSelector');
    const input = document.getElementById('targetcfg');
    if (sel.options[sel.selectedIndex].value == 'input') {
      input.style.visibility = 'visible';
    } else {
      input.style.visibility = 'hidden';
    }
  });

  update(true, true);
})();