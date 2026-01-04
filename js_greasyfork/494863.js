// ==UserScript==
// @name         craftofexile fix tier mods affecting weights
// @namespace    http://tampermonkey.net/
// @version      2024-05-16
// @description  This script implements the changes proposed in the following reddit posed by wcnsb2010. It tries to fix the weights which are affected by mod tier rating. When using tier rating, mods with only one or few tiers will be less common. https://www.reddit.com/r/pathofexile/comments/1cq6dxh/how_tier_rating_actuallywork_in_this_league/
// @author       fixcraftofexile
// @match        https://www.craftofexile.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=craftofexile.com
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/494863/craftofexile%20fix%20tier%20mods%20affecting%20weights.user.js
// @updateURL https://update.greasyfork.org/scripts/494863/craftofexile%20fix%20tier%20mods%20affecting%20weights.meta.js
// ==/UserScript==

poec_processColumn = new_poec_processColumn;

poec_necroModifyPoolWithEffects = new_poec_necroModifyPoolWithEffects;

function necro_calc_tier_multiplier(R, M) {
  // R = Tier Rating, M = total number of tiers for this mod
    var tier_multipl = (100 * M) / (100 + R)
    if(tier_multipl > 1.0) {
        tier_multipl = 1.0;
    }
    return tier_multipl;
}

function new_poec_getGraveyardCuttingPct(R, M) {
  if (M <= 1) {
      return 0.5;
  }
  // R = Tier Rating, M = total number of tiers for this mod
  let cutting_pct = M - 100 * (M-1) / (R + 99);
  return cutting_pct;
};

function new_poec_necroModifyPoolWithEffects(modpool, effects) {
  if (effects.tiers) {
    effects.tiers = effects.tiers / 100
  }
  if (effects.weight) {
    $.each(
      effects.weight,
      function (k, v) {
        effects.weight[k] = v / 100;
        if (v < 0) {
          let num = Math.abs(effects.weight[k]);
          effects.weight[k] = 1 / (num + 1)
        }
      }
    )
  }
  $.each(
    modpool,
    function (modId, tiers) {
      let pos_mod = 0;
      let neg_mod = 0;
      let tier_filter = 0;
      if (poec_necroMTypesIndex[modId]) {
        $.each(
          poec_necroMTypesIndex[modId],
          function (ind, mtype) {
            if (effects.weight) {
              if (effects.weight[mtype]) {
                if (effects.weight[mtype] > 1) {
                  pos_mod += effects.weight[mtype]
                } else {
                  if (neg_mod == 0) {
                    neg_mod = (1 / effects.weight[mtype]) - 1
                  } else {
                    neg_mod += (1 / effects.weight[mtype]) - 1
                  }
                }
              }
            }
          }
        )
      }
      if (effects.haunted) {
        if (tiers[0].id_mgroup == 16) {
          pos_mod += effects.haunted[0]
        }
      }
      if (effects.prefix) {
        if (tiers[0].atype == 'prefix') {
          pos_mod += effects.prefix[0]
        }
      } else {
        if (effects.suffix) {
          if (tiers[0].atype == 'suffix') {
            pos_mod += effects.suffix[0]
          }
        }
      }
      if (effects.tiers) {
        if (effects.tiers) {
          tier_filter += effects.tiers
        }
      }
      let affect_mod = 1;
      if (pos_mod != 0 || neg_mod != 0) {
        if (pos_mod > 0) pos_mod++;
        if (neg_mod > 0) neg_mod++;
        if (pos_mod == 0) {
          pos_mod = 1
        }
        if (neg_mod == 0) {
          neg_mod = 1
        }
        affect_mod = pos_mod * (1 / neg_mod)
      }
      let cut_tiers = 0;
      if (tier_filter > 0) {
        tier_filter = new_poec_getGraveyardCuttingPct(tier_filter*100, tiers.length);
        cut_tiers = Math.floor(tier_filter)
      }
      let tierNumber = 0;
      $.each(
        tiers,
        function (tk, tv) {
          tierNumber++;
          if (tierNumber <= cut_tiers) {
            modpool[modId][tk].tweight = 0
          } else {
            var tier_multipl = necro_calc_tier_multiplier(effects.tiers * 100, tiers.length);
            modpool[modId][tk].tweight = tv.tweight * affect_mod * tier_multipl;
          }
        }
      )
    }
  );
  return modpool
}

function new_poec_processColumn(
  cdata,
  atype,
  forceopt,
  forceweight,
  forcetitle,
  coltitle,
  amglist,
  maxcover
) {
  var dnow = poec_startDiag('Process column ' + atype);
  var vHtml = '';
  var allWeight = 0;
  var allTiers = 0;
  var allMods = 0;
  var allMTypes = {};
  var allBinds = {};
  var blockGrp = !1;
  var unblockGrp = !1;
  if (poec_affixFilters.inf != undefined) {
    if (poec_affixFilters.inf == '1') {
      blockGrp = !0
    } else {
      unblockGrp = !0
    }
  }
  var filter_is = null;
  var filter_non = null;
  $.each(
    poec_affixFilters,
    function (key, val) {
      if (key != 'inf') {
        if (val == '1') {
          if (!filter_is) {
            filter_is = '|'
          }
          filter_is += key + '|'
        } else {
          if (!filter_non) {
            filter_non = '|'
          }
          filter_non += key + '|'
        }
      }
    }
  );
  remByILvl[atype] = {
    'tiers': 0,
    'weight': 0
  };
  $.each(
    cdata,
    function (mgroup, affixes) {
      var gvalid = !0;
      var normal = !1;
      var nobld = 0;
      var infchoose = !1;
      var is_delve = !1;
      if (
        poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].poedb_id == 'delve'
      ) {
        is_delve = !0
      }
      var is_influence = !1;
      if (poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].is_influence == 1) {
        is_influence = !0;
        if (poec_cInfluences) {
          if (poec_cInfluences.indexOf('|' + mgroup + '|') > - 1) {
            if (!poec_baseActive) {
              nobld = 1
            }
            infchoose = !0
          } else {
          }
        } else {
        }
        if (poec_nBase.i == 8201) {
          infchoose = !0
        }
      } else {
        if (!poec_baseActive) {
          normal = !0
        } else {
          if (
            poec_cMethod == 'exalted' &&
            poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].poedb_id == 'delve'
          ) {
            normal = !0
          } else {
            if (
              poec_cMethod != 'fossil' &&
              poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].poedb_id == 'delve'
            ) {
              gvalid = !1
            }
          }
        }
      }
      if (gvalid) {
        if (poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].is_compute == 1) {
          var iscomp = 1
        } else {
          var iscomp = 0
        }
        if (normal) {
          var iscomp = 0
        }
        if (
          poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].is_influence == 1 &&
          !infchoose
        ) {
          var iscomp = 0
        }
        if (forceopt) {
          iscomp = 0
        }
        var gtiers = 0;
        var gweight = 0;
        var vGroup = '';
        var addgrpcls = '';
        if (!iscomp) {
          if (poec_groupToggles.indexOf('|' + mgroup + '|') > - 1) {
            addgrpcls = ' toggled'
          }
        }
        if (
          poec_cMethod == 'fossil' &&
          poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].poedb_id == 'delve' &&
          (!poec_cFossils || poec_cFossils == '|')
        ) {
          var iscomp = 0
        }
        if (maxcover) {
          var maxcmods = maxcover
        } else {
          if (metasActive.mul_mods && mgroup == poec_cCraftedGrpID) {
            var maxcmods = 3
          } else {
            var maxcmods = poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].max_chosen
          }
        }
        var showweight = !1;
        if (mgroup == 10) {
          showweight = !0;
          coltitle = 'Unveil'
        }
        if (forceopt) {
          var tgid = atype
        } else {
          var tgid = mgroup
        }
        vGroup += '<div class=\'agroup med_shadow div_stable at_' + atype + ' fo_' + forceopt + ' fw_' + forceweight + ' compute' + iscomp + ' nobld' + nobld + ' iinf' + poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].is_influence + ' selectable mgrp mgrp' + mgroup + ' ' + addgrpcls + '\' atype=\'' + atype + '\' gid=\'' + tgid + '\' maxc=\'' + maxcmods + '\'>';
        vGroup += '<div class=\'header line\' onClick=\'poec_toggleOptAgroup(this)\'>';
        if (forcetitle) {
          var grptitle = forcetitle
        } else {
          var grptitle = poecl.mgroup[mgroup]
        }
        if (!coltitle) {
          coltitle = atype
        }
        vGroup += '<div class=\'label\'><div>' + grptitle + '</div></div>';
        vGroup += '<div class=\'right\'><div>' + applyLang('Tiers') + '</div></div>';
        vGroup += '<div class=\'right\'><div>' + applyLang('iLvl') + '</div></div>';
        if (iscomp || is_influence || forceweight || showweight) {
          vGroup += '<div class=\'right\'><div>' + applyLang('Weight') + '</div></div>';
          if (poec_cVMode == 'd') {
            vGroup += '<div class=\'right capitalize\'><div>' + coltitle + ' %</div></div>';
            if (iscomp || is_influence) {
              vGroup += '<div class=\'right\'><div>' + applyLang('Weight %') + '</div></div>'
            }
          }
        }
        if (atype == 'corrupted') {
          vGroup += '<div class=\'right\' title=\'' + applyLang('Chance to achieve with a vaal orb') + '\'><div>' + applyLang('Vaal %') + '</div></div>'
        } else {
          vGroup += '<div class=\'grp\' title=\'' + applyLang('Modifier Group') + '\'><div>G</div></div>'
        }
        vGroup += '</div>';
        var nvaffix = 0;
        for (var i = 0; i < affixes.length; i++) {
          var skip_affix = !1;
          if (is_delve && iscomp) {
            if (poec_cFossils != null) {
              if (poec_cFossils.length > 1) {
                if (poec_cFossils.indexOf('|' + affixes[i].id_fossil + '|') > - 1) {
                  skip_affix = !1
                } else {
                  skip_affix = !0
                }
              }
            }
          }
          if (affixes[i].ubt) {
            if (affixes[i].ubt != poec_nBase.i) {
              skip_affix = !0
            }
          }
          if (exmods != '' && affixes[i].exkey) {
            if (exmods == affixes[i].exkey) {
              skip_affix = !0
            }
          }
          if (!skip_affix) {
            nvaffix++;
            if (mgroup == 999) {
              var ntiers = 1;
              var milvl = 1
            } else {
              var ntiers = poecd.tiers[affixes[i].id_modifier][poec_cBase].length;
              var milvl = poecd.tiers[affixes[i].id_modifier][poec_cBase][poecd.tiers[affixes[i].id_modifier][poec_cBase].length - 1].ilvl
            }
            var addcls = '';
            if (nvaffix % 2 == 0) {
              addcls += ' even'
            } else {
              addcls += ' odd'
            }
            var htypes = '';
            var ctypes = '';
            var mmtgs = '';
            var clstypes = '';
            var is_blocked = !1;
            var is_bld = !1;
            var num_more = 0;
            var num_less = 0;
            var affect_mod = null;
            var pos_mod = null;
            var neg_mod = null;
            var cat_mod = 0;
            var harvest_found = !1;
            var filter_block = !1;
            var has_cats = '|';
            var amodgroups = affixes[i].modgroups;
            var attrgroups = '';
            for (zy = 0; zy < amodgroups.length; zy++) {
              addcls += ' amodgrp_' + amodgroups[zy];
              attrgroups += '|' + amodgroups[zy]
            }
            attrgroups = attrgroups.substring(1, attrgroups.length);
            if (affixes[i].mtypes) {
              if (poec_isSlam && (metasActive.no_caster || metasActive.no_attack)) {
                if (poec_isSlam) {
                  if (
                    metasActive.no_caster &&
                    affixes[i].mtypes.indexOf('|13|') > - 1 &&
                    !poec_cBuild[affixes[i].id_modifier] &&
                    affixes[i].id_modifier != poec_cCasterModID
                  ) {
                    addcls += ' block';
                    is_blocked = !0
                  }
                  if (
                    metasActive.no_attack &&
                    affixes[i].mtypes.indexOf('|3|') > - 1 &&
                    !poec_cBuild[affixes[i].id_modifier] &&
                    affixes[i].id_modifier != poec_cAttackModID
                  ) {
                    addcls += ' block';
                    is_blocked = !0
                  }
                }
              }
            }
            var tamgs = poec_getAMGs(
              poecd.modifiers.seq[poecd.modifiers.ind[affixes[i].id_modifier]].amg
            );
            if (tamgs) {
              for (var h = 0; h < tamgs.length; h++) {
                if (amglist.indexOf('|' + tamgs[h] + '|') > - 1) {
                  addcls += ' block';
                  is_blocked = !0
                }
              }
            }
            var necropolis_tier_filtering = null;
            var filter_found = !1;
            if (affixes[i].mtypes) {
              if (affixes[i].mtypes.length > 1) {
                var mtypes = affixes[i].mtypes.substring(1, affixes[i].mtypes.length - 1).split('|');
                var bypasstypes = {};
                if (fossilHybrids) {
                  for (var q = 0; q < fossilHybrids.length; q++) {
                    var match_fail = !1;
                    for (var r = 0; r < fossilHybrids[q].ids.length; r++) {
                      if (
                        affixes[i].mtypes.indexOf('|' + fossilHybrids[q].ids[r] + '|') > - 1
                      ) {
                      } else {
                        match_fail = !0
                      }
                    }
                    if (!match_fail) {
                      for (var r = 0; r < fossilHybrids[q].ids.length; r++) {
                        bypasstypes[fossilHybrids[q].ids[r]] = !0
                      }
                      if (fossilHybrids[q].pos == 0) {
                        addcls += ' block';
                        is_blocked = !0
                      } else {
                        if (fossilHybrids[q].pos != 1) {
                          if (pos_mod == null) {
                            pos_mod = fossilHybrids[q].pos
                          } else {
                            if (poec_cFosMode == 'a') {
                              pos_mod += fossilHybrids[q].pos
                            } else {
                              pos_mod = pos_mod * fossilHybrids[q].pos
                            }
                          }
                        }
                        if (fossilHybrids[q].neg != 1) {
                          if (neg_mod == null) {
                            neg_mod = fossilHybrids[q].neg
                          } else {
                            neg_mod = neg_mod * fossilHybrids[q].neg
                          }
                        }
                      }
                    }
                  }
                }
                for (var j = 0; j < mtypes.length; j++) {
                  clstypes += ' mt' + mtypes[j];
                  if (poecd.mtypes.seq[poecd.mtypes.ind[mtypes[j]]] == undefined) {
                    console.log('j:' + j);
                    console.log('mtypes[j]:' + mtypes[j]);
                    console.log(mtypes);
                    console.log(affixes[i])
                  }
                  var jbase = poecd.mtypes.seq[poecd.mtypes.ind[mtypes[j]]].jewellery_tag;
                  if (jbase == 0 || (jbase == 1 && poec_cIsJewelleryBase == !0)) {
                    htypes += '<div class=\'mt tmt' + mtypes[j] + ' sml_shadow\' title=\'Fossil/Harvest Tag\'>' + poecl.mtype[mtypes[j]] + '</div>';
                    poecFilterPresence[mtypes[j]] = !0
                  }
                  if (!is_blocked) {
                    if (fossilSets && iscomp) {
                      if (fossilSets.block[mtypes[j]]) {
                        addcls += ' block';
                        is_blocked = !0
                      } else {
                        if (bypasstypes[mtypes[j]] == undefined) {
                          var poedbid = poecd.mtypes.seq[poecd.mtypes.ind[mtypes[j]]].poedb_id;
                          if (fossilModsCalc[poedbid] != undefined) {
                            if (fossilModsCalc[poedbid].pos != 1) {
                              if (pos_mod == null) {
                                pos_mod = fossilModsCalc[poedbid].pos
                              } else {
                                if (poec_cFosMode == 'a') {
                                  pos_mod += fossilModsCalc[poedbid].pos
                                } else {
                                  pos_mod = pos_mod * fossilModsCalc[poedbid].pos
                                }
                              }
                            }
                            if (fossilModsCalc[poedbid].neg != 1) {
                              if (neg_mod == null) {
                                neg_mod = fossilModsCalc[poedbid].neg
                              } else {
                                neg_mod = neg_mod * fossilModsCalc[poedbid].neg
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  if (poec_cCataBase) {
                    var poedbid = poecd.mtypes.seq[poecd.mtypes.ind[mtypes[j]]].poedb_id;
                    if (poec_catRepo[poedbid] != undefined) {
                      if (poec_cCatalyst == poec_catIRepo[poedbid]) {
                      }
                      if (
                        has_cats.indexOf(
                          '|' + poecd.catalysts.seq[poec_catRepo[poedbid]].id_catalyst + '|'
                        ) > - 1
                      ) {
                      } else {
                        has_cats += poecd.catalysts.seq[poec_catRepo[poedbid]].id_catalyst + '|';
                        ctypes += '<div class=\'mt cat cmt' + poecd.catalysts.seq[poec_catRepo[poedbid]].id_catalyst + '\' title=\'Catalyst : ' + poecl.catalyst[poecd.catalysts.seq[poec_catRepo[poedbid]].id_catalyst] + '\'><img src=\'images/ui/catsml_' + poecd.catalysts.seq[poec_catRepo[poedbid]].id_catalyst + '.png\'/></div>'
                      }
                    }
                  }
                  if (peoc_cGraveyardEffect) {
                    if (peoc_cGraveyardEffect.weight) {
                      if (peoc_cGraveyardEffect.weight[mtypes[j]]) {
                        if (peoc_cGraveyardEffect.weight[mtypes[j]] >= 1) {
                          pos_mod += peoc_cGraveyardEffect.weight[mtypes[j]]
                        } else {
                          if (neg_mod == null) {
                            neg_mod = (1 / peoc_cGraveyardEffect.weight[mtypes[j]]) - 1
                          } else {
                            neg_mod += (1 / peoc_cGraveyardEffect.weight[mtypes[j]]) - 1
                          }
                        }
                      }
                    }
                  }
                  if (filter_is) {
                    if (filter_is.indexOf('|' + mtypes[j] + '|') > - 1) {
                      filter_found = !0
                    }
                  }
                  if (filter_non) {
                    if (filter_non.indexOf('|' + mtypes[j] + '|') > - 1) {
                      filter_block = !0
                    }
                  }
                }
              }
            }

            if (peoc_cGraveyardEffect) {
              if (peoc_cGraveyardEffect.tiers) {
                necropolis_tier_filtering += peoc_cGraveyardEffect.tiers
              }
              if (peoc_cGraveyardEffect.prefix && atype == 'prefix') {
                pos_mod += peoc_cGraveyardEffect.prefix
              }
              if (peoc_cGraveyardEffect.suffix && atype == 'suffix') {
                pos_mod += peoc_cGraveyardEffect.suffix
              }
              if (peoc_cGraveyardEffect.haunted && mgroup == 16) {
                pos_mod += peoc_cGraveyardEffect.haunted
              }
            }
            if (!filter_found && filter_is) {
              filter_block = !0
            }
            if (blockGrp && !is_influence) {
              addcls += ' block';
              is_blocked = !0
            }
            if (unblockGrp && is_influence) {
              addcls += ' block';
              is_blocked = !0
            }
            if (filter_block) {
              addcls += ' block';
              is_blocked = !0
            }
            if (curEssence) {
              var eblock = !1;
              for (zy = 0; zy < amodgroups.length; zy++) {
                for (zw = 0; zw < curEssence.modgroups.length; zw++) {
                  if (curEssence.modgroups[zw] == amodgroups[zy]) {
                    eblock = !0
                  }
                }
              }
              if (curEssence.atype == atype && eblock) {
                addcls += ' block';
                is_blocked = !0
              }
            }
            if (pos_mod != null || neg_mod != null) {
              if (peoc_cGraveyardEffect && pos_mod !== null) {
                pos_mod++
              }
              if (peoc_cGraveyardEffect && neg_mod !== null) {
                neg_mod++
              }
              if (pos_mod == null) {
                pos_mod = 1
              }
              if (neg_mod == null) {
                neg_mod = 1
              }
              if (peoc_cGraveyardEffect) {
                neg_mod = 1 / neg_mod
              }
              affect_mod = pos_mod * neg_mod
            }
            if (cat_mod > 0) {
              affect_mod = 1 + parseFloat(cat_mod)
            }
            var modtags = '';
            var modifier = 1;
            if (affect_mod != null) {
              if (affect_mod > 1) {
                affect_mod = Math.round(affect_mod * 1000) / 1000;
                modtags += '<div class=\'wt cat_' + poec_cCatalysts + ' mr sml_shadow\'>x' + affect_mod + '</div>'
              } else {
                if (affect_mod < 1) {
                  affect_mod = Math.round(affect_mod * 1000) / 1000;
                  var strval = String(affect_mod);
                  modtags += '<div class=\'wt ls sml_shadow\'>x' + strval.substring(1, strval.length) + '</div>'
                }
              }
              modifier = modifier * affect_mod
            }
            var tweight = 0;
            var oweight = 0;
            var htiers = '';
            var untiers = ntiers;
            var tallweight = 0;
            var mxlvl = 0;
            var modreq = !1;
            if (mgroup == 999) {
            } else {
              if (poec_cUniqueNotable) {
                if (affixes[i].notable == '1') {
                  attrgroups += '|unique_notable';
                  addcls += ' amodgrp_unique_notable'
                }
              }
              let cut_tiers = 0;
              let cut_weight = 0;
              let remaining_weight = 0;
              if (necropolis_tier_filtering) {
                //let cutting_pct = poec_getGraveyardCuttingPct(necropolis_tier_filtering);
                let number_of_tiers = 0;
                for (
                  var j = 0;
                  j < poecd.tiers[affixes[i].id_modifier][poec_cBase].length;
                  j++
                ) {
                  var htilvl = parseInt(poecd.tiers[affixes[i].id_modifier][poec_cBase][j].ilvl);
                  if (poec_cILvl && htilvl > poec_cILvl) {
                  } else {
                    number_of_tiers++
                  }
                }
                // old tier cutting
                //cut_tiers = Math.floor(number_of_tiers * cutting_pct);
                // new tier cutting
                cut_tiers = Math.floor(new_poec_getGraveyardCuttingPct(necropolis_tier_filtering*100, poecd.tiers[affixes[i].id_modifier][poec_cBase].length));

                if (cut_tiers > 0) {
                  let tierNumber = 0;
                  for (
                    var j = 0;
                    j < poecd.tiers[affixes[i].id_modifier][poec_cBase].length;
                    j++
                  ) {
                    tierNumber++;
                    var htilvl = parseInt(poecd.tiers[affixes[i].id_modifier][poec_cBase][j].ilvl);
                    var bhtweight = parseInt(poecd.tiers[affixes[i].id_modifier][poec_cBase][j].weighting);
                    if (poec_cILvl && htilvl > poec_cILvl) {
                    } else {
                      if (tierNumber <= cut_tiers) {
                        cut_weight += bhtweight
                      } else {
                        remaining_weight += bhtweight
                      }
                    }
                  }
                }
              }
              var tierNumber = 0;
              for (
                var j = 0;
                j < poecd.tiers[affixes[i].id_modifier][poec_cBase].length;
                j++
              ) {
                tierNumber++;
                var htilvl = parseInt(poecd.tiers[affixes[i].id_modifier][poec_cBase][j].ilvl);
                var bhtweight = parseInt(poecd.tiers[affixes[i].id_modifier][poec_cBase][j].weighting);
                var sanceff = 0;
                if (sanctifiedActive) {
                  sanceff = bhtweight * ((htilvl - 40) / 100)
                }
                var htweight = Math.round((bhtweight + sanceff) * modifier);
                if (cut_weight > 0) {
                  if (tierNumber <= cut_tiers) {
                  } else {
                  }
                }

                if (peoc_cGraveyardEffect) {
                  if (peoc_cGraveyardEffect.tiers) {
                    //if (tierNumber > cut_tiers) {
                      var tier_multipl = necro_calc_tier_multiplier(peoc_cGraveyardEffect.tiers * 100, poecd.tiers[affixes[i].id_modifier][poec_cBase].length);
                      htweight = Math.round(htweight * tier_multipl * 1) / 1
                    //}
                  }
                }

                var otweight = parseInt(poecd.tiers[affixes[i].id_modifier][poec_cBase][j].weighting);
                oweight += otweight;
                var addtcls = '';
                if (poec_cBuild[affixes[i].id_modifier] != undefined) {
                  if (poec_cBuild[affixes[i].id_modifier] == htilvl) {
                    if (
                      poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].is_influence == 0 ||
                      (
                        poecd.mgroups.seq[poecd.mgroups.ind[mgroup]].is_influence == 1 &&
                        iscomp == 1
                      )
                    ) {
                      addtcls += ' bld';
                      foundBlds[affixes[i].id_modifier] = !0;
                      is_bld = !0
                    }
                  }
                }
                if ((poec_cILvl && htilvl > poec_cILvl) || tierNumber <= cut_tiers) {
                  addtcls = ' block';
                  untiers--;
                  remByILvl[atype].tiers++;
                  remByILvl[atype].weight += htweight
                } else {
                  tweight += htweight;
                  if (htilvl > mxlvl) {
                    mxlvl = htilvl
                  }
                  if (poec_cSettings[affixes[i].id_modifier] != undefined) {
                    if (poec_cSettings[affixes[i].id_modifier] != null) {
                      if (poec_cSettings[affixes[i].id_modifier].l == htilvl) {
                        addtcls += ' req';
                        modreq = (ntiers - j);
                        foundReqs[affixes[i].id_modifier] = !0
                      }
                    }
                  }
                  if (poec_cImps[affixes[i].id_modifier] != undefined) {
                    if (poec_cImps[affixes[i].id_modifier] == ntiers - j) {
                      addtcls += ' bld';
                      foundImps[affixes[i].id_modifier] = !0
                    }
                  }
                }
                if (modreq) {
                  if ((ntiers - j) < modreq) {
                    addtcls += ' areq'
                  }
                }
                tallweight += htweight;
                htiers += '<div class=\'affix line tier tier' + (ntiers - j) + ' ntiers' + ntiers + ' ilvl' + htilvl + ' aid' + affixes[i].id_modifier + addtcls + ' vex' + affixes[i].vex + '\' modgrp=\'' + attrgroups + '\' tier=' + (ntiers - j) + ' aid=\'' + affixes[i].id_modifier + '\' ilvl=\'' + poecd.tiers[affixes[i].id_modifier][poec_cBase][j].ilvl + '\' atype=\'' + atype + '\' onClick=\'poec_toggleReqAffix(this)\'>';
                if (poecd.tiers[affixes[i].id_modifier][poec_cBase][j].alias) {
                  var ffname = poec_checkTrans(poecd.tiers[affixes[i].id_modifier][poec_cBase][j].alias)
                } else {
                  var ffname = poecd_parseMName(
                    poec_checkTrans(affixes[i].name_modifier, poecl.mod[affixes[i].id_modifier]),
                    poecd.tiers[affixes[i].id_modifier][poec_cBase][j].nvalues,
                    affixes[i].id_modifier
                  )
                }
                if (poec_nBase.g == 11 || poec_nBase.g == 15) {
                  ffname = poec_parseMapName(ffname)
                }
                htiers += '<div class=\'label\'><div>' + ffname + '</div></div>';
                htiers += '<div class=\'right\'><div>' + (ntiers - j) + '</div></div>';
                htiers += '<div class=\'right\'><div>' + htilvl + '</div></div>';
                if (iscomp || is_influence || forceweight || showweight) {
                  htiers += '<div class=\'right fcomp\'><div class=\'weight\' aval=\'' + htweight + '\' oval=\'' + otweight + '\'>' + htweight + '</div></div>';
                  if (poec_cVMode == 'd') {
                    htiers += '<div class=\'right fcomp\'><div class=\'apct\'></div></div>';
                    if (iscomp || is_influence) {
                      htiers += '<div class=\'right fcomp\'><div class=\'roll\'></div></div>'
                    }
                  }
                }
                if (atype == 'corrupted') {
                  htiers += '<div class=\'right fcomp\'><div class=\'vaal\'></div></div>'
                } else {
                  htiers += '<div class=\'grp\'><div></div></div>'
                }
                htiers += '</div>'
              }
            }
            var tmtypes = '';
            if (iscomp) {
              if (affixes[i].mtypes) {
                if (affixes[i].mtypes.length > 1) {
                  tmtypes = affixes[i].mtypes;
                  var mtypes = affixes[i].mtypes.substring(1, affixes[i].mtypes.length - 1).split('|');
                  for (var j = 0; j < mtypes.length; j++) {
                    if (allMTypes[mtypes[j]] == undefined) {
                      allMTypes[mtypes[j]] = {
                        'weighting': 0,
                        'tiers': 0
                      }
                    }
                    allMTypes[mtypes[j]].weighting += tweight;
                    allMTypes[mtypes[j]].tiers += ntiers
                  }
                }
              }
            }
            if (!is_blocked) {
              if (!is_bld) {
                if (iscomp || forceweight) {
                  allWeight += tweight;
                  allTiers += untiers;
                  allMods++
                }
                gtiers += untiers;
                if (affixes[i].vex == 0) {
                  gweight += tweight
                }
              }
              if (!iscomp && poec_cMethod != 'annul') {
                foundReqs[affixes[i].id_modifier] = !1
              }
            } else {
              if (iscomp || poec_cMethod == 'annul') {
                foundReqs[affixes[i].id_modifier] = !1
              }
              if (
                poec_cMethod == 'annul' &&
                (metasActive.nchg_pre || metasActive.nchg_suf)
              ) {
              } else {
              }
            }
            if (untiers != ntiers) {
              var ftiers = untiers + ' <span class=\'obs\'>(' + ntiers + ')</span>'
            } else {
              var ftiers = ntiers
            }
            if (tallweight != tweight) {
              var fweight = tweight + ' <span class=\'obs\'>(' + tallweight + ')</span>'
            } else {
              var fweight = tweight
            }
            if (mxlvl != milvl) {
              var filvl = mxlvl + ' <span class=\'obs\'>(' + milvl + ')</span>'
            } else {
              var filvl = milvl
            }
            if (poec_cSettings[affixes[i].id_modifier] != undefined) {
              if (poec_cSettings[affixes[i].id_modifier] != null) {
                addcls += ' req'
              }
            }
            if (poec_cBuild[affixes[i].id_modifier] != undefined) {
              if (poec_cBuild[affixes[i].id_modifier] != null) {
                addcls += ' bld'
              }
            }
            if (poec_cImps[affixes[i].id_modifier] != undefined) {
              if (poec_cImps[affixes[i].id_modifier] != null) {
                addcls += ' bld'
              }
            }
            if (ntiers <= 1 && mgroup != 999) {
              var show_name = poecd_parseMName(
                poec_checkTrans(affixes[i].name_modifier, poecl.mod[affixes[i].id_modifier]),
                poecd.tiers[affixes[i].id_modifier][poec_cBase][0].nvalues,
                affixes[i].id_modifier
              )
            } else {
              var show_name = poecl.mod[affixes[i].id_modifier]
            }
            if (untiers <= 0) {
              addcls += ' block'
            }
            if (affixes[i].meta != null) {
              addcls += ' ismeta'
            }
            var addfos = '';
            if (affixes[i].id_fossil) {
              addfos = '<div class=\'fos\' title=\'' + poecl.fossil[affixes[i].id_fossil] + ' Fossil\'><img src=\'images/ui/fossil_' + affixes[i].id_fossil + '.png\'/></div>'
            }
            var addess = '';
            if (mgroup == poec_cEssGrpID) {
              if (
                poecd.essences.seq[poecd.essences.ind[poecd.essences.dir[poec_cBase][affixes[i].id_modifier]]] == undefined
              ) {
              } else {
                var essname = poecd.essences.seq[poecd.essences.ind[poecd.essences.dir[poec_cBase][affixes[i].id_modifier]]].name_essence;
                addess = '<div class=\'fos\' title=\'Essence of ' + essname + '\'><img src=\'images/ui/essence_' + essname + '.png\'/></div>'
              }
            }
            if (poecd.mdefs[affixes[i].id_modifier] != undefined) {
              addcls += ' mdef'
            }
            var mgshow = '';
            for (zy = 0; zy < amodgroups.length; zy++) {
              if (allBinds[amodgroups[zy]] == undefined) {
                allBinds[amodgroups[zy]] = bind_cnt;
                bindGrpCounts[atype][bind_cnt] = 0;
                bind_cnt++
              }
              bindGrpCounts[atype][allBinds[amodgroups[zy]]]++;
              addcls += ' bg' + allBinds[amodgroups[zy]];
              mgshow += ',' + allBinds[amodgroups[zy]]
            }
            if (poec_cUniqueNotable) {
              if (affixes[i].notable == '1') {
                addcls += ' bg9999';
                mgshow += ',N'
              }
            }
            mgshow = mgshow.substring(1, mgshow.length);
            var maeven = '';
            if (
              poecd.maeven.bmods[poec_cBase + '-' + affixes[i].id_modifier] !== undefined
            ) {
              addcls += ' maeven';
              maeven = '<div class=\'mvico\' mvid=\'' + poecd.maeven.bmods[poec_cBase + '-' + affixes[i].id_modifier] + '\'></div>'
            }
            var tamgcls = poec_getAMGcls(tamgs);
            if (poec_nBase.g == 11 || poec_nBase.g == 15) {
              show_name = poec_parseMapName(show_name)
            }
            vGroup += '<div class=\'affix line main maid' + affixes[i].id_modifier + ' ' + clstypes + ' ' + addcls + ' ' + tamgcls + ' vex' + affixes[i].vex + '\' amg=\'' + poecd.modifiers.seq[poecd.modifiers.ind[affixes[i].id_modifier]].amg + '\' amodgrp=\'' + attrgroups + '\' bindgrp=\'' + mgshow + '\' untiers=\'' + untiers + '\' oweight=\'' + oweight + '\' tweight=\'' + tweight + '\' aid=\'' + affixes[i].id_modifier + '\' ntiers=\'' + ntiers + '\' wgtmod=\'' + modifier + '\' atype=\'' + atype + '\' mtypes=\'' + tmtypes + '\' onClick=\'poec_toggleAffixTiers(this)\'>';
            vGroup += '<div class=\'label\'><div>' + maeven + show_name + htypes + mmtgs + ctypes + modtags + addfos + addess + '</div></div>';
            vGroup += '<div class=\'right\'><div>' + ftiers + '</div></div>';
            vGroup += '<div class=\'right\'><div>' + filvl + '</div></div>';
            if (iscomp || is_influence || forceweight || showweight) {
              vGroup += '<div class=\'right fcomp\'><div class=\'weight\' aval=\'' + tweight + '\'>' + fweight + '</div></div>';
              if (poec_cVMode == 'd') {
                vGroup += '<div class=\'right fcomp\'><div class=\'apct\'></div></div>';
                if (iscomp || is_influence) {
                  vGroup += '<div class=\'right fcomp\'><div class=\'roll\'></div></div>'
                }
              }
            }
            if (atype == 'corrupted') {
              vGroup += '<div class=\'right fcomp\'><div class=\'vaal\'></div></div>'
            } else {
              vGroup += '<div class=\'grp\'><div class=\'num\'>' + mgshow + '</div></div>'
            }
            vGroup += '</div>';
            vGroup += htiers
          }
        }
        vGroup += '<div class=\'total line\'>';
        vGroup += '<div class=\'label\'><div>Total</div></div>';
        vGroup += '<div class=\'right\'><div class=\'gtiers\'>' + gtiers + '</div></div>';
        vGroup += '<div class=\'right\'><div>&nbsp;</div></div>';
        if (iscomp || is_influence || forceweight || showweight) {
          vGroup += '<div class=\'right fcomp\'><div class=\'weight\' aval=\'' + gweight + '\'>' + gweight + '</div></div>';
          if (poec_cVMode == 'd') {
            vGroup += '<div class=\'right fcomp\'><div class=\'apct\'></div></div>';
            if (iscomp || is_influence) {
              vGroup += '<div class=\'right fcomp\'><div class=\'roll\'></div></div>'
            }
          }
        }
        if (atype == 'corrupted') {
          vGroup += '<div class=\'right fcomp\'><div class=\'vaal\'></div></div>'
        } else {
          vGroup += '<div class=\'grp\'><div></div></div>'
        }
        vGroup += '</div>';
        vGroup += '</div>';
        if (nvaffix > 0) {
          vHtml += vGroup
        }
      }
    }
  );
  vHtml += '<input type=\'hidden\' id=\'allweight_' + atype + '\' value=\'' + allWeight + '\'/>';
  vHtml += '<input type=\'hidden\' id=\'alltiers_' + atype + '\' value=\'' + allTiers + '\'/>';
  vHtml += '<input type=\'hidden\' id=\'allmods_' + atype + '\' value=\'' + allMods + '\'/>';
  vHtml += '<div class=\'hidden\' id=\'allmtypes_' + atype + '\'>' + JSON.stringify(allMTypes) + '</div>';
  poec_endDiag('Process column ' + atype, dnow);
  return vHtml
}