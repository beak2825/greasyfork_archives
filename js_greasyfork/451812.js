function PublusCoordsGenerator(e, t, r, i, n) { // imageWidth, imageHeight, pieceWidth, pieceHeight, pattern
  const calcPositionWithRest_ = function (e, t, r, i) {
    return e * i + (e >= t ? r : 0)
  }

  const calcXCoordinateXRest_ = function (e, t, r) {
    return (e + 61 * r) % t
  }

  const calcYCoordinateXRest_ = function (e, t, r, i, n) {
    var s, a, o = n % 2 == 1;
    return (e < t ? o : !o) ? (a = r,
        s = 0) : (a = i - r,
        s = r),
      (e + 53 * n + 59 * r) % a + s
  }

  const calcXCoordinateYRest_ = function (e, t, r, i, n) {
    var s, a, o = n % 2 == 1;
    return (e < r ? o : !o) ? (a = i - t,
        s = t) : (a = t,
        s = 0),
      (e + 67 * n + t + 71) % a + s
  }

  const calcYCoordinateYRest_ = function (e, t, r) {
    return (e + 73 * r) % t
  }

  var s, a, o, u, c, p, l, m, d, h, y = Math.floor(e / r),
    g = Math.floor(t / i),
    f = e % r,
    b = t % i,
    S = [];
  if (s = y - 43 * n % y,
    s = s % y == 0 ? (y - 4) % y : s,
    s = 0 == s ? y - 1 : s,
    a = g - 47 * n % g,
    a = a % g == 0 ? (g - 4) % g : a,
    a = 0 == a ? g - 1 : a,
    f > 0 && b > 0 && (o = s * r,
      u = a * i,
      S.push({
        srcX: o,
        srcY: u,
        destX: o,
        destY: u,
        width: f,
        height: b
      })),
    b > 0)
    for (l = 0; l < y; l++)
      d = calcXCoordinateXRest_(l, y, n),
      h = calcYCoordinateXRest_(d, s, a, g, n),
      c = calcPositionWithRest_(d, s, f, r),
      p = h * i,
      o = calcPositionWithRest_(l, s, f, r),
      u = a * i,
      S.push({
        srcX: o,
        srcY: u,
        destX: c,
        destY: p,
        width: r,
        height: b
      });
  if (f > 0)
    for (m = 0; m < g; m++)
      h = calcYCoordinateYRest_(m, g, n),
      c = (d = calcXCoordinateYRest_(h, s, a, y, n)) * r,
      p = calcPositionWithRest_(h, a, b, i),
      o = s * r,
      u = calcPositionWithRest_(m, a, b, i),
      S.push({
        srcX: o,
        srcY: u,
        destX: c,
        destY: p,
        width: f,
        height: i
      });
  for (l = 0; l < y; l++)
    for (m = 0; m < g; m++)
      h = (m + 37 * n + 41 * (d = (l + 29 * n + 31 * m) % y)) % g,
      c = d * r + (d >= calcXCoordinateYRest_(h, s, a, y, n) ? f : 0),
      p = h * i + (h >= calcYCoordinateXRest_(d, s, a, g, n) ? b : 0),
      o = l * r + (l >= s ? f : 0),
      u = m * i + (m >= a ? b : 0),
      S.push({
        srcX: o,
        srcY: u,
        destX: c,
        destY: p,
        width: r,
        height: i
      });
  return S;
}