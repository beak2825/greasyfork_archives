// ==UserScript==
// @name        AO3 Qscore
// @description Autosorting 'Quality' Indicator trained on 11k+ works. Very generous with small fics, rewards engagement over popularity (bookmarks-collections/kudos instead of hits) with a 0-100 score spread. Sort & position toggles included.
// @version     2.35
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @match       https://archiveofourown.org/*
// @grant       GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535088/AO3%20Qscore.user.js
// @updateURL https://update.greasyfork.org/scripts/535088/AO3%20Qscore.meta.js
// ==/UserScript==
'use strict';

// ======================== CONFIGURATION ========================

const SORT_USER_PAGE = true;

/*
# Scoring:
There are 3 metrics pairs: (bookmarks, collections, comments)/kudos.
Each pair has a trained regression model validated above a certain `min`.
Each metric is tested against min, and if it passes, it is scored by the model; otherwise it gets dimmed to 0.
The final score is derived by mixing all valid scores using a blend of MAX() and AVERAGE().

- MAX     Keeps the best score, rewards works at the top of any single metric.
          Gives 100 scores if any of the metrics are 100.
- AVERAGE Rewards works with the most high scores, and most valid metrics (3>2>1).
          Missing scores bring down the final score by blending in a 0.
          Only gives 100 scores if all three metrics are 100.

Lowering `min` to be more generous with small works and show more scores
would corrupt the top scores by making the models generate outside of their range.

To solve this, I added `bmin`. If all the metrics are invalid (<min), the score
is recomputed with the lower `>bmin` threshold. These scores are dimmed and placed at the bottom.
Scores that fail this test as well get a dimmed 0.
Since these scores are less accurate, they use a separate `BMIN_ALPHA` factor to smooth them more.

  If you do not care about being generous with small works, you can set 'ENABLE_BMIN=false',
and raise the `dim_below` thresholds to fold more final scores in the dimmed section,
or raise `min` but this will use the worse `bmin` to score those in the dimmed section.
  OR, if you want to adjust the separate BMIN_ALPHA for dimmed scores,
you can keep `min=dim_below` and raise `bmin` and `min` directly .
*/

// Add indicators showing the individual scores with z_scale applied (bookmarks, collections, comments).
// Border color: yellow=bmin_valid, red=invalid.
const DEBUG = false;

// Blending factor between MAX and AVERAGE `finalScore = A*MAX+(1-A)*AVG`. 1=MAX, 0=AVERAGE
const ALPHA      = 0.99;
const BMIN_ALPHA = 0.75;
const ENABLE_BMIN = true;

// Weight of missing scores in the Average formula.
// Example: (ALPHA=0.7, zero_weight=0.3, avg_weight=1): 2 valid + 1 invalid (−3 pts); 1 valid + 2 invalid (−10 pts);
const AVG_ZERO_WEIGHT = 0.3;

// `min`        Metrics below this value are invalid and will not contribute to the final ALPHA blended score.
// `bmin`       Bottom min. If ENABLE_BMIN=true, invalid final scores are *rescored* with `bmin` and `BMIN_ALPHA`, dimmed and sorted at the end.
//
// `dim_below`  Dim final scores if all metrics are below this second threshold.
//              This is a convenience to hide smaller works without touching min.
//              `dim_below=0` is disabled and default to `min`: the only dimmed scores are from the range [bmin,min[.
// `avg_weight` Weight of a score in the weighted AVERAGE score.
// `z_scale`    Scales the positive z-scores, resulting in fewer 100s for that metric.
//              To halve the number of 100 scores: const Halve100 = 0.9176338854906885;
//                                                 const Halve99  = 0.892167842806324;
const THRESHOLDS = {
  'kudos':       { bmin: 5, min: 8, /**/ dim_below: 0 }, // Gates all others.
  //
  'bookmarks':   { bmin: 1, min: 3, /**/ dim_below: 0, avg_weight: 1.0, z_scale: 1.0 },
  'collections': { bmin: 1, min: 2, /**/ dim_below: 0, avg_weight: 1.0, z_scale: 1.0 },
  'comments':    { bmin: Infinity, min: Infinity, /**/ dim_below: 0, avg_weight: 1.0, z_scale: 1.0 }, // bmin: 3, min: 3
  //
  'chapters':    { bmin: 1, min: 2, /**/ dim_below: 0 }
};
// Replace {.dim_below=0 by .min}
Object.values(THRESHOLDS).forEach(obj => obj.dim_below === 0 && (obj.dim_below = obj.min));
// Note on 'chapters':
//    ('comments','kudos') is actually ('comment_per_chapter','kudos_per_chapter').
//    which is why this metric is gated on 'chapters' as well.

// ======================== MODEL & CONSTANTS ========================

let MODEL = {"Z_95": 1.0364333894937898, "regressions": [{"x_metric": "bookmarks", "y_metric": "kudos", "x_grid": [0.0, 0.3323, 0.6646, 0.997, 1.3293, 1.6616, 1.9939, 2.3263, 2.6586, 2.9909, 3.3232, 3.6556, 3.9879, 4.3202, 4.6525, 4.9849, 5.3172, 5.6495, 5.9818, 6.3142, 6.6465, 6.9788, 7.3111, 7.6435, 7.9758, 8.3081, 8.6404, 8.9728, 9.3051, 9.6374, 9.9697, 10.3021, 10.6344, 10.9667, 11.299, 11.6314, 11.9637, 12.296, 12.6283, 12.9607], "q05_curve_y": [2.1722, 2.3297, 2.4859, 2.6704, 2.9142, 3.2016, 3.5162, 3.8411, 4.1655, 4.4864, 4.8014, 5.1093, 5.4097, 5.7043, 5.9953, 6.2845, 6.5734, 6.863, 7.1536, 7.4456, 7.7394, 8.036, 8.337, 8.6442, 8.9592, 9.2832, 9.6137, 9.9459, 10.2753, 10.5945, 10.894, 11.1935, 11.493, 11.7925, 12.092, 12.3915, 12.691, 12.9905, 13.29, 13.5895], "q50_curve_y": [2.6252, 2.8076, 2.99, 3.1987, 3.4591, 3.7542, 4.0665, 4.3786, 4.6822, 4.9785, 5.2694, 5.5568, 5.8423, 6.1263, 6.4088, 6.6897, 6.9693, 7.2481, 7.5271, 7.8075, 8.0904, 8.3768, 8.6675, 8.9631, 9.2643, 9.5715, 9.883, 10.1953, 10.5046, 10.8076, 11.1071, 11.4066, 11.7061, 12.0056, 12.3051, 12.6046, 12.9041, 13.2036, 13.5031, 13.8026], "q95_curve_y": [3.2949, 3.4494, 3.6051, 3.7878, 4.0228, 4.2933, 4.5821, 4.8722, 5.1554, 5.4336, 5.7092, 5.9846, 6.2616, 6.5397, 6.8183, 7.0964, 7.3736, 7.6496, 7.925, 8.2006, 8.4768, 8.7546, 9.0347, 9.3182, 9.606, 9.899, 10.1957, 10.493, 10.7875, 11.0783, 11.3778, 11.6773, 11.9768, 12.2763, 12.5758, 12.8753, 13.1748, 13.4743, 13.7738, 14.0733], "mu": 0.010967210394413519, "sigma": 1.0618674385105822}, {"x_metric": "collections", "y_metric": "kudos", "x_grid": [0.0, 0.1849, 0.3698, 0.5547, 0.7395, 0.9244, 1.1093, 1.2942, 1.4791, 1.664, 1.8489, 2.0338, 2.2186, 2.4035, 2.5884, 2.7733, 2.9582, 3.1431, 3.328, 3.5128, 3.6977, 3.8826, 4.0675, 4.2524, 4.4373, 4.6222, 4.8071, 4.9919, 5.1768, 5.3617, 5.5466, 5.7315, 5.9164, 6.1013, 6.2861, 6.471, 6.6559, 6.8408, 7.0257, 7.2106], "q05_curve_y": [1.414, 2.2679, 3.0662, 3.8165, 4.5249, 5.1912, 5.8014, 6.3417, 6.8012, 7.1803, 7.486, 7.7255, 7.9099, 8.0571, 8.1842, 8.3065, 8.4306, 8.5581, 8.6903, 8.8278, 8.9698, 9.1149, 9.2619, 9.4096, 9.5572, 9.7011, 9.8291, 9.957, 10.0849, 10.2129, 10.3408, 10.4688, 10.5967, 10.7246, 10.8526, 10.9805, 11.1085, 11.2364, 11.3644, 11.4923], "q50_curve_y": [4.6143, 5.0468, 5.4793, 5.9118, 6.344, 6.7656, 7.1615, 7.5184, 7.8241, 8.0778, 8.2846, 8.4498, 8.5805, 8.6882, 8.7847, 8.8811, 8.9822, 9.0886, 9.2013, 9.3202, 9.4438, 9.5706, 9.6989, 9.8278, 9.9566, 10.0849, 10.2128, 10.3408, 10.4687, 10.5966, 10.7246, 10.8525, 10.9805, 11.1084, 11.2363, 11.3643, 11.4922, 11.6202, 11.7481, 11.8761], "q95_curve_y": [7.5724, 7.5553, 7.6064, 7.7156, 7.8738, 8.0693, 8.2843, 8.4997, 8.6981, 8.872, 9.021, 9.1463, 9.2512, 9.3418, 9.4254, 9.5093, 9.596, 9.6856, 9.7781, 9.8735, 9.9715, 10.0714, 10.1726, 10.2747, 10.3775, 10.4844, 10.6124, 10.7403, 10.8683, 10.9962, 11.1241, 11.2521, 11.38, 11.508, 11.6359, 11.7638, 11.8918, 12.0197, 12.1477, 12.2756], "mu": -0.021871244232891534, "sigma": 1.0510446029054428}, {"x_metric": "comments", "y_metric": "kudos", "x_grid": [0.0, 0.3328, 0.6657, 0.9985, 1.3314, 1.6642, 1.9971, 2.3299, 2.6628, 2.9956, 3.3285, 3.6613, 3.9942, 4.327, 4.6599, 4.9927, 5.3256, 5.6584, 5.9913, 6.3241, 6.657, 6.9898, 7.3227, 7.6555, 7.9884, 8.3212, 8.6541, 8.9869, 9.3198, 9.6526, 9.9855, 10.3183, 10.6512, 10.984, 11.3169, 11.6497, 11.9826, 12.3154, 12.6483, 12.9811], "q05_curve_y": [2.0093, 2.3035, 2.5978, 2.8931, 3.1913, 3.4928, 3.7983, 4.1076, 4.4169, 4.7214, 5.0158, 5.2959, 5.5604, 5.8098, 6.0444, 6.2648, 6.4745, 6.6782, 6.8804, 7.0851, 7.289, 7.4859, 7.6695, 7.8344, 7.9817, 8.116, 8.2422, 8.3681, 8.495, 8.6219, 8.7488, 8.8757, 9.0026, 9.1294, 9.2563, 9.3832, 9.5101, 9.637, 9.7639, 9.8908], "q50_curve_y": [2.8284, 3.1258, 3.4232, 3.7217, 4.0229, 4.3275, 4.636, 4.9483, 5.2606, 5.5679, 5.8652, 6.1481, 6.4155, 6.6677, 6.9051, 7.1284, 7.3411, 7.5479, 7.7533, 7.9612, 8.1685, 8.369, 8.5563, 8.7249, 8.8761, 9.0144, 9.1446, 9.2716, 9.3984, 9.5253, 9.6522, 9.7791, 9.906, 10.0329, 10.1597, 10.2866, 10.4135, 10.5404, 10.6673, 10.7942], "q95_curve_y": [3.6809, 3.9759, 4.271, 4.5671, 4.866, 5.1684, 5.4748, 5.785, 6.0954, 6.4009, 6.6965, 6.9777, 7.2435, 7.4942, 7.7301, 7.9519, 8.1631, 8.3682, 8.5721, 8.7784, 8.9842, 9.183, 9.3686, 9.5355, 9.6847, 9.8211, 9.9493, 10.0758, 10.2027, 10.3296, 10.4564, 10.5833, 10.7102, 10.8371, 10.964, 11.0909, 11.2178, 11.3446, 11.4715, 11.5984], "mu": -0.02560361702737164, "sigma": 1.0479841045712814}]};

/* -- Halve100 --
from scipy.stats import norm
z = norm.ppf(98.5/100)      # round([99.5,100]) = 100
p = 0.5 * (1 - norm.cdf(z)) # make 100s half as likely
print("sigma scale:", z / norm.ppf(1 - p))
*/

// --- HELPER FUNCTIONS ---
function interpolate(xs, ys, targetX) {
  if (targetX <= xs[0]) return ys[0];
  if (targetX >= xs[xs.length - 1]) return ys[ys.length - 1];
  const i = xs.findIndex(x => x > targetX) - 1;
  const fraction = (targetX - xs[i]) / (xs[i + 1] - xs[i]);
  return ys[i] + fraction * (ys[i + 1] - ys[i]);
}

function sum(arr) { return arr.reduce((a, b) => a + b, 0); }

function ncdf(z) {
  let t = 1 / (1 + 0.2315419 * Math.abs(z));
  let d = 0.3989423 * Math.exp(-z * z / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) prob = 1 - prob;
  return prob;
}

// ======================== CORE SCORING FUNCTION ========================

function calculateScore(article, metrics) {
  let valid_scores = []
  let bmin_valid_scores = []
  let all_scores = []
  let all_dimmed = true;

  for (const regression of MODEL.regressions) {
    const x_metric = regression.x_metric; // bookmarks
    const y_metric = regression.y_metric; // kudos

    let is_valid =
      metrics[x_metric] >= THRESHOLDS[x_metric].min &&
      metrics[y_metric] >= THRESHOLDS[y_metric].min &&
      (x_metric === 'comments' ? metrics['chapters'] >= THRESHOLDS['chapters'].min : true);

    let is_bmin_valid =
      is_valid ||
      metrics[x_metric] >= THRESHOLDS[x_metric].bmin &&
      metrics[y_metric] >= THRESHOLDS[y_metric].bmin &&
      (x_metric === 'comments' ? metrics['chapters'] >= THRESHOLDS['chapters'].bmin : true);

    let not_dimmed =
        is_valid &&
        metrics[x_metric] >= THRESHOLDS[x_metric].dim_below &&
        metrics[y_metric] >= THRESHOLDS[y_metric].dim_below &&
        (x_metric === 'comments' ? metrics['chapters'] >= THRESHOLDS['chapters'].dim_below : true);
    if (not_dimmed) all_dimmed = false;

    // Compute score
    const x_point = Math.log1p(metrics[x_metric]);
    const y_point = Math.log1p(metrics[y_metric]);

    const y_center = interpolate(regression.x_grid, regression.q50_curve_y, x_point);
    const y_lower  = interpolate(regression.x_grid, regression.q05_curve_y, x_point);
    const y_upper  = interpolate(regression.x_grid, regression.q95_curve_y, x_point);

    let ratio;
    let z_scale = 1.0;
    if (y_point >= y_center) {
      const upper_diff = y_upper - y_center;
      ratio = (upper_diff > 1e-6) ? (y_point - y_center) / upper_diff : 0.0;
    } else {
      const lower_diff = y_center - y_lower;
      ratio = (lower_diff > 1e-6) ? (y_point - y_center) / lower_diff : 0.0;
      z_scale = THRESHOLDS[x_metric].z_scale; // only scale positive zscores
    }
    const z_score = - MODEL.Z_95 * ratio; // flip the upside down graph

    const standardized_z = (z_score - regression.mu) / regression.sigma;
    const score = 100 * ncdf(standardized_z * z_scale);

    let res = { x_metric, score, is_valid, is_bmin_valid, dimmed: !not_dimmed, weight: THRESHOLDS[x_metric].avg_weight };
    if (is_valid)      valid_scores.push(res);
    if (is_bmin_valid) bmin_valid_scores.push(res);
    all_scores.push(res);
  }

  const valid = (valid_scores.length > 0);
  const bmin_valid = (bmin_valid_scores.length > 0);

  if (valid) {
    // AVERAGE
    let premult_sum = 0.0,
        weights_sum = 0.0;
    for (let s of all_scores) {
        premult_sum += s.is_valid ? s.score * s.weight : 0.0;
        weights_sum += s.is_valid ? s.weight           : s.weight * AVG_ZERO_WEIGHT;
    }
    let avg_score = premult_sum / weights_sum;

    // MAX
    let max_score = 0.0;
    for (let s of valid_scores) max_score = Math.max(max_score, s.score);

    const final_score = ALPHA * max_score + (1 - ALPHA) * avg_score;

    return [final_score, valid, true, all_dimmed, all_scores];
  }

  if (ENABLE_BMIN && bmin_valid) {
    // AVERAGE
    let premult_sum = 0.0,
        weights_sum = 0.0;
    for (let s of all_scores) {
        premult_sum += s.is_bmin_valid ? s.score * s.weight : 0.0;
        weights_sum += s.is_bmin_valid ? s.weight           : s.weight * AVG_ZERO_WEIGHT;
    }
    let avg_score = premult_sum / weights_sum;

    // MAX
    let max_score = 0.0; // include invalid
    for (let s of bmin_valid_scores) max_score = Math.max(max_score, s.score);

    const final_score = BMIN_ALPHA * max_score + (1 - BMIN_ALPHA) * avg_score;

    return [final_score, false, true, true, all_scores];
  }

  return [0, false, false, true, all_scores];
}

// ---------------------------------- COLORS ----------------------------------

GM_addStyle(`
  /* half width navbar toggle */
  .halfWidth { width: 1.3ch !important; padding: 0.429em calc(0.75em/1) !important; }

  /* Indicator styling */
  .scoreA { display: inline-block; width: 28px; text-align: center; line-height: 18px; padding: 0; color: rgb(42,42,42); }  /* em scales different on mobile */

  /* Position inside Work pages (needs repeated selector to win) */
  .inWork.inWork.inWork          .scoreA { float: right; }  /* .stats becomes float:left inside works */
  .inWork.inWork.inWork.inCorner .scoreA { position: absolute; top: 10px; right: 10px; z-index: 1; }

   /* Default corner position */
  .inCorner .scoreA { position: absolute; top: -3px; right: -2px; }
  .inCorner .isDate { top: 17px; }

   /* Move extra below the corner Private Bookmark icon */
  .inCorner.cornerFull:not(.khx-collapsed) .isDate { top: calc(17px + 28px); }
  .inCorner.cornerFull:not(.khx-collapsed) .scoreA { top: 27px; }

  /* ?? khx fix skipped before:: text
   .skipped-work .isDate { top: -18px; } */

  @-moz-document url-prefix() {
    @media (max-width: 655px) {
      .scoreA {
        width: 26px; /* on desktop 26px doesn't cover the date, 27 does, but the 26px gap looks nicer on mobile. */
      }
    }
  }
  :root {
    --boost:    85%;
    --boostDM:  75%; /* 82%; */
    --darken:   55%;
    --darkenDM: 33.3%;
  }
  :root.dark-theme {
    --darken: var(--darkenDM);
    --boost:  var(--boostDM);
  }
  .scoreA {
    background-image: linear-gradient(hsl(0, 0%, var(--boost)), hsl(0, 0%, var(--boost)));
    background-blend-mode: color-burn;
  }
  .scoreA.darkenA, .darkenA {
    background-image: linear-gradient(hsl(0, 0%, var(--darken)), hsl(0, 0%, var(--darken)));
    background-blend-mode: multiply;
  }
  .invalidA { border: solid 1px #d00 }
  .validA { border: solid 1px #008d00 }
  .bminValidA { border: solid 1px #e1a518 }
`);


const isDarkMode = window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128;
if (isDarkMode) document.documentElement.classList.add('dark-theme');

const HSL_STRINGS = [
  'hsl(0.0, 90.7%, 92.3%)',
  'hsl(47.8, 67.1%, 81.5%)',
  'hsl(118.4, 51.2%, 85%)',
  'hsl(122.9, 35.1%, 63.4%)',
];
const COLORS = HSL_STRINGS.map(str => (([h, s, l]) => ({ h, s, l }))(str.match(/[\d.]+/g).map(Number)));

function clamp(a, b, x) { return x < a ? a : (x > b ? b : x); }
function color(t, range=1.0, use3colors=false) {
  let a, b;
  t = t/range;
  if (t < 0)   { t = 0.0; }
  if (use3colors && t > 1.0) { t = 1.0; }
  else if (t > 1.5) { t = 1.5; }

  if (t < 0.5) {
    a = COLORS[0], b = COLORS[1];
    t = t * 2.0;
  } else if (t <= 1.0) {
    a = COLORS[1], b = COLORS[2];
    t = (t - 0.5) * 2.0;
  } else {
    a = COLORS[2], b = COLORS[3];
    t = (t - 1.0) * 2.0;
  }
  const h = clamp(0, 360, a.h + (b.h - a.h) * t);
  const s = clamp(0, 100, a.s + (b.s - a.s) * t);
  const l = clamp(0, 100, a.l + (b.l - a.l) * t);
  return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
}

// ---------------------------------- NAVBAR ----------------------------------
let navSortingString = null;
let sortingTxt = ['⇊', '⇅'];
let navCornerString = null;
let cornerTxt = ['⇱', '⇲'];
{
  let navbar = document.querySelector('ul.primary');
  if (navbar) {
    let searchBox = navbar.querySelector('.search');
    if (searchBox) {
      {
        let li = document.createElement('li');
        li.classList.add('dropdown');
        navSortingString = localStorage.getItem('C89AO3_sorting') || sortingTxt[0];
        navSortingString = sortingTxt.includes(navSortingString) ? navSortingString : sortingTxt[0];
        let a = document.createElement('a');
        a.className = 'halfWidth';
        a.textContent = navSortingString;
        a.href = '#';
        a.addEventListener('click', (e) => {
          navSortingString = sortingTxt[(sortingTxt.indexOf(a.textContent) + 1) % sortingTxt.length];
          a.textContent = navSortingString;
          localStorage.setItem('C89AO3_sorting', navSortingString);
          a.blur();
          toggleSorting(true);
        });
        li.appendChild(a);
        navbar.insertBefore(li, searchBox);
      }
      {
        let li = document.createElement('li');
        li.classList.add('dropdown');
        navCornerString = localStorage.getItem('C89AO3_corner') || cornerTxt[0];
        navCornerString = cornerTxt.includes(navCornerString) ? navCornerString : cornerTxt[0];
        let a = document.createElement('a');
        a.className = 'halfWidth';
        a.textContent = navCornerString;
        a.href = '#';
        a.addEventListener('click', (e) => {
          navCornerString = cornerTxt[(cornerTxt.indexOf(a.textContent) + 1) % cornerTxt.length];
          a.textContent = navCornerString;
          localStorage.setItem('C89AO3_corner', navCornerString);
          a.blur();
          toggleCorner();
        });
        li.appendChild(a);
        navbar.insertBefore(li, searchBox);
      }
    }
  }
}

// ---------------------------------- MAIN ----------------------------------

const commaRegex = /,/g
function parse(str) {
  return str ? parseInt(str.replace(commaRegex, ''), 10) : null;
}

let sortingData = [];
const articles = document.querySelectorAll('li.work[role="article"], li.bookmark[class*="work-"], dl.work.meta.group');

function removeOldScores() {
  document.querySelectorAll('.scoreA').forEach(el => el.remove());
}

function isVisible(el) { return window.getComputedStyle(el).display !== "none"; }

function processArticles() {
  removeOldScores();
  sortingData = [];
  let i = 0;

  for (let article of articles) {
    let bookmarkCornerOccupied = !!article.querySelector('.status'); // isVisible(article.querySelector('.status'));
    let insideAWork = article?.tagName === 'DL';

    let stats = article.querySelector('dl.stats');
    if (!stats) continue;

    const metrics = {
      bookmarks:   parse(stats.querySelector('dd.bookmarks')?.textContent) || 0,
      collections:
        insideAWork
          ? article.querySelector('dd.collections')?.children.length || 0
          : parse(stats.querySelector('dd.collections')?.textContent) || 0,
      comments:    parse(stats.querySelector('dd.comments')?.textContent) || 0,
      kudos:       parse(stats.querySelector('dd.kudos')?.textContent) || 0,
      chapters:    parse(stats.querySelector('dd.chapters')?.textContent.split('/')[0]) || 1,
    };


    if (bookmarkCornerOccupied) article.classList.add('cornerFull');
    if (insideAWork)            article.classList.add('inWork');


    let [finalScore, valid, bmin_valid, dimmed, all_scores] = calculateScore(article, metrics);

    function makeIndicator(score) {
      const el = document.createElement('span');
      el.classList.add('scoreA');
      el.textContent = Math.round(score);
      el.style.backgroundColor = Number.isNaN(score) ? '#b8b8b8' : color(score / 100, 1, true);
      if (dimmed) el.classList.add('darkenA');
      return el;
    }

    stats.appendChild(document.createTextNode(' '));

    const indicator = makeIndicator(finalScore);
    stats.appendChild(indicator);

    if (DEBUG) {
    const span = document.createElement("span");
    span.textContent = indicator.textContent;
    span.style.minWidth = '28px';
    span.style.zIndex = '999';
    span.style.boxShadow = 'rgba(0, 0, 0, 0.38) 0px 0px 10px';

    indicator.textContent = '';
    indicator.prepend(span);

    indicator.style.display     = 'flex';
    indicator.style.alignItems  = 'center';
    indicator.style.right = '85px';
    if (!valid) {
      if (bmin_valid) indicator.classList.add('bminValidA');
        else          indicator.classList.add('invalidA');
    }

    stats.appendChild(indicator);

    all_scores.forEach(({ score, dimmed, is_valid, is_bmin_valid }) => {
        const dbg = makeIndicator(score);
        if (dimmed) dbg.classList.add('darkenA');
        if (is_valid)            {} // dbg.classList.add('validA');
        else if (is_bmin_valid) dbg.classList.add('bminValidA');
        else                    dbg.classList.add('invalidA');
        dbg.style.position = 'static';
        dbg.style.display = 'inline-block';
        dbg.style.minWidth = '28px';
        indicator.appendChild(dbg);
      });
    }

    let sortKey = dimmed ? finalScore : finalScore + 100;
    sortingData.push({ indicator, article, score: finalScore, index: i++, bookmarkCornerOccupied, insideAWork, sortKey });
  }
}

function updateAllScores() {
  processArticles();
  toggleSorting();
  toggleCorner();
}

// ---------------------------------- SORTING ----------------------------------

let isSorted = false;
function toggleSorting(manual=false) {
  if (location.href.includes('/users/') && !SORT_USER_PAGE && !manual) return; // don't sort user pages unless manually toggled
  if (location.href.includes('/series/')) return; // keep series pages chronological

  let parent = articles[0]?.parentNode;
  if (parent) {
    let run = false;
    if (navSortingString === sortingTxt[0]) {
      sortingData.sort((a, b) => b.sortKey - a.sortKey); isSorted = true;  run = true;
    } else if (isSorted) {
      sortingData.sort((a, b) => a.index - b.index); isSorted = false; run = true;
    }
    if (run) sortingData.forEach(({ article }) => {
      parent.appendChild(article);
    });
  }
}

// ---------------------------------- CORNER TOGGLE ----------------------------------

let isInCorner = false;
function toggleCorner() {
  let run = false;
  if (navCornerString === cornerTxt[0]) {
    isInCorner = true;  run = true;
  } else if (isInCorner) {
    isInCorner = false; run = true;
  }
  if (run) {
    sortingData.forEach(({ article, indicator, insideAWork }) => {
      if (indicator) {
        article.querySelector('.datetime')?.classList.add('isDate'); // can be null if inside a work

        if (isInCorner) {
          let cornerParent = insideAWork ? article : article.querySelector('div.header.module');
          if (cornerParent) {
            article.classList.add('inCorner');
            cornerParent.appendChild(indicator);
          }
        }
        else {
          let stats = article.querySelector('dl.stats');
          if (stats) {
            article.classList.remove('inCorner');
            stats.appendChild(indicator);
          }
        }
      }
    });
  }
}

updateAllScores()
