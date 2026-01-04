// ==UserScript==
// @name			TM dat
// @namespace		https://icelava.root
// @version			0.8.3
// @description		Nested, type secure and auto saving data proxy on Tampermonkey.
// @author			ForkKILLET
// @include			http://localhost:1633/*
// @noframes
// @icon			data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant			unsafeWindow
// @grant			GM_listValues
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_deleteValue
// ==/UserScript==

"use strict"

const clone = o => JSON.parse(JSON.stringify(o))

const err = (t, m) => { throw window[t](`[TM dat] ${m}`) }

const op = "GM" in Window ? {
	get: GM_getValue,
	set: GM_setValue,
	del: GM_deleteValue,
	list: GM_listValues
} : {
	get: k => localStorage.getItem(k),
	set: (k, v) => localStorage.setItem(k, v),
	del: k => localStorage.removeItem(k),
	list: () => Object.keys(localStorage)
}

/* eslint-disable */
const type_dat = v =>
	v?.__scm__?.ty		? v.__scm__.ty	:
	v === null			? "null"		:
	v instanceof Array  ? "array"		:
	v instanceof RegExp ? "regexp"		:
	typeof v
/* eslint-enable */

type_dat.convert = {
	string_number:  v => + v,
	string_regexp:  v => v,
	number_string:  v => "" + v,
	number_boolean: v => !! v
}

let raw_dat

const proto_scm = {
	object:	{ rec: 1, ctn: () => ({}) },
	tuple:	{ rec: 1, ctn: () => [] },
	array:	{ rec: 2, ctn: () => [], api: (A, P, s = P.__scm__, tar = P.__tar__) => ({
		$new(i, n = 1) {
			for (const j = i + n; i < j; i ++) {
				const scm = A.scm.lvs[j]
				if (scm) err("ReferenceError", `Leaf @ ${scm.path} already exists, but was attempted to re-new.`)
				init_scm(A, j, P, tar, true)
			}
		},
		get $length() {
			return s.lvs.length
		},
		$push(...a) {
			a.forEach(v => P[ s.lvs.length ] = v)
			return s.lvs.length
		},
		$fill(v, i = 0, j = s.lvs.length) {
			for (; i < j; i ++) P[i] = v
			return P
		},
		$pop() {
			const l = s.lvs.length
			const v = P[ l - 1 ]
			delete P[ l - 1 ]
			s.lvs.length --
			return v
		},
		$splice(i, n) {
			const l = s.lvs.length
			n ??= l
			n = Math.min(l - i, n)
			for(; i < l; i ++)
				P[i] = i + n < l ? P[ i + n ] : undefined
			s.lvs.length -= n
		},
		$swap(i, j) {
			P.__tmp__ = P[i]
			P[i] = P[j]
			P[j] = P.__tmp__
			delete P.__tmp__
		},
		$reverse() {
			const l = s.lvs.length
			const m = Math.floor(l / 2)
			for (let i = 0; i < m; i ++) if (i in s.lvs) {
				P.$swap(i, l - i - 1)
			}
			return P
		},
		$includes(v) {
			const l = s.lvs.length
			for (let i = 0; i < l; i ++) if (i in s.lvs)
				if (v === P[i]) return true
			return false
		},
		$indexOf(v) {
			const l = s.lvs.length
			for (let i = 0; i < l; i ++) if (i in s.lvs)
				if (v === P[i]) return + i
			return -1
		},
		$lastIndexOf(v) {
			for (let i = s.lvs.length - 1; i >= 0; i --) if (i in s.lvs)
				if (v === P[i]) return + i
			return -1
		},
		$find(f) {
			const l = s.lvs.length
			for (let i = 0; i < l; i ++) if (i in s.lvs) {
				const v = P[i]
				if (f(v)) return v
			}
		},
		$findIndex(f) {
			const l = s.lvs.length
			for (let i = 0; i < l; i ++) if (i in s.lvs) {
				const v = P[i]
				if (f(v)) return + i
			}
		},
		$forEach(f) {
			const l = s.lvs.length
			for (let i = 0; i < l; i ++) if (i in s.lvs)
				f(P[i], + i, P)
		},
		$at(i) {
			return i < 0 ? P[ s.lvs.length + i ] : P[i]
		},
		*[Symbol.iterator] () {
			for (const k in s.lvs) yield P[k]
		}
	}) },
}

const init_scm = (A, k, P, tar, isNew) => {
	const { dat, map, scm, oldRoot, old } = A
	if (isNew) scm.lvs[k] = clone(scm.itm)
	const s = scm.lvs[k]
	s.path = (scm.path ?? "") + "." + k

	const proto = proto_scm[s.ty]
	s.rec = proto?.rec ?? 0
	if (s.rec) {
		dat[k] = proto.ctn()
		if (s.rec > 1) s.lvs = proto.ctn()
	}

	const eS = s => JSON.stringify(s, null, 2) + ": "

	if (s.ty === "enum") {
		s.get ??= "val"
		s.set ??= "val"
		s.fromOld = v => {
			let set = s.set
			s.set = "id"
			P[k] = v
			s.set = set
		}
		if (s.get !== "both" && s.set === "both") err("SyntaxError", eS(s) + `{ ty: "enum" → ¬(get: "both" ∧ set: ¬ "both") }`)
	}
	if (s.ty === "tuple") s.lvs = s.lvs.flatMap(
		i => {
			let r = 1
			if ("repeat" in i) {
				r = i.repeat
				if (typeof r !== "number" || r < 0 || r % 1)
					err("SyntaxError", eS(s) + `{ ty: "tuple" → itm: [ ∀ i: { repeat?: integer } } ]`)
				delete i.repeat
			}
			return Array.from({ length: r }, () => clone(i))
		}
	)

	map(s)
	s.pathRoot = s.root ? "#" + s.path : scm.pathRoot ?? k
	s.raw = (s.root ? null : scm.raw) ?? (() => dat[k])

	const Ak = {
		dat: dat[k],
		map,
		scm: s,
		oldRoot,
		old: old?.[k]
	}

	if (s.rec) tar[k] = proxy_dat(Ak)
	else {
		let old_v = s.root ? oldRoot[s.pathRoot] : old?.[k]
		if (old_v !== undefined) {
			if (s.ty === "enum") s.fromOld(old_v)
			else P[k] = old_v
		}
		else if ("dft" in s) P[k] = s.dft
	}

	if (proto?.api) s.api = proto.api(Ak, tar[k])
}

const proxy_dat = A => {
	const { dat, scm, oldRoot, old } = A
	const tar = {}

	const eP = `Parent ${scm.ty} @ ${scm.path}`
	const cAR = k => {
		if (typeof k === "symbol") return
		if (scm.ty === "array") {
			const eR = eP + ` requires the index to be in [ ${scm.minIdx ??= 0}, ${scm.maxIdx ??= +Infinity} ], but got ${k}. `
			if (k < scm.minIdx || k > scm.maxIdx) err("RangeError", eR)
		}
	}
	const P = new Proxy(tar, {
		get: (_, k) => {
			if (k === "__scm__") return scm
			if (k === "__tar__") return tar
			if (scm.api && k in scm.api) return scm.api[k]

			const s = scm.lvs[k]
			if (s.ty === "enum") switch (s.get) {
			case "id":
				return tar[k]
			case "val":
				return s.vals[tar[k]]
			case "both":
				return {
					get id() { return tar[k] },
					set id(v) {
						const o_set = s.set
						s.set = "id"
						P[k] = v
						s.set = o_set
					},
					get val() { return s.vals[tar[k]] },
					set val(v) {
						const o_set = s.set
						s.set = "val"
						P[k] = v
						s.set = o_set
					},
				}
			}

			cAR(k)
			return tar[k]
		},

		set: (_, k, v) => {
			cAR(k)

			if (! scm.lvs[k]) switch (scm.rec) {
			case 1:
				err("TypeError", eP + ` doesn't have leaf ${k}.`)
				break
			case 2:
				init_scm(A, k, P, tar, true)
				break
			}

			if (scm.api && k in scm.api) {
				err("TypeError", eP + ` has API ${k}. Failed.`)
			}
			const s = scm.lvs[k]

			const eF = `Leaf @ ${s.path}`, eS = "Failed strictly.", eT = eF + ` is ${ [ "simple", "fixed complex", "flexible complex" ][s.rec] } type, `
			if (s.locked) err("TypeError", eF + ` is locked, but was attempted to modify.`)

			const ty = type_dat(v)

			if (ty === "undefined") {
				if (scm.rec === 1 && ! scm.del) err("TypeError", eT + `but its ` + eF + " was attempted to delete.")
				if (s.rec) {
					s.del = true
					for (let j in s.lvs) delete tar[k][j]
				}
				delete scm.lvs[k]
			}

			else if (
				ty === "array"	&& s.lvs instanceof Array ||
				ty === "object"	&& s.lvs && ! (s.lvs instanceof Array)
			) {
				for (let j in s.lvs) tar[k][j] = v[j]
				return true
			}

			else if (! [ "any", "enum" ].includes(s.ty) && ty !== s.ty) {
				const eM = eF + ` requires type ${s.ty}, but got ${ty}: ${v}. `
				if (s.strict) err("TypeError", eM + eS)
				const f = type_dat.convert[`${ty}_${s.ty}`]
				if (f) v = f(v)
				else err("TypeError", eM + "Failed to convert.")
			}

			if (s.ty === "number") {
				const eR = eF + ` requires to be in [ ${ s.min ?? -Infinity }, ${ s.max ?? +Infinity } ], but got ${v}. `
				if (v < s.min || v > s.max) err("RangeError", eR)

				if (s.int && v % 1) {
					if (s.strict) err("RangeError", eF + ` requires to be an integer. ` + eS)
					v = Math.floor(v)
				}
			}

			else if (s.ty === "enum") switch (s.set) {
			case "id":
				if (typeof v !== "number" || ! v in s.vals)
					err("RangeError", eF + ` requires to be an enum index in [ ${0}, ${s.vals.length} ], but got ${v}.`)
				break
			case "val":
				v = s.vals.findIndex(val => val === v)
				if (v < 0)
					err("RangeError", eF + ` requires to be in the enum { ${ s.vals.join(", ") } }, but got ${v}.`)
				break
			case "both":
				err("TypeError", eF + ` is an enum accepting both id and value ways of modification, but was attempted to modify without using any setter.`)
			}

			tar[k] = dat[k] = v
			if (s.quick || s.root) {
				const vRoot = s.raw()
				if (vRoot === undefined) op.del(s.pathRoot)
				else op.set(s.pathRoot, JSON.stringify(vRoot))
			}

			return true
		},

		deleteProperty: (_, k) => {
			P[k] = undefined
			return true
		},

		has: (_, k) => k in scm.lvs
	})

	switch (scm.rec) {
	case 1:
		for (let k in scm.lvs) init_scm(A, k, P, tar)
		break
	case 2:
		const keys = scm.itmRoot
			? Object.keys(oldRoot).map(k => k.match(String.raw`^#${scm.path}\.([^.]+)`)?.[1]).filter(k => k)
			: Object.keys(old ?? {})
		keys.forEach(k => init_scm(A, k, P, tar, true))
		break
	}

	return P
}

const load_dat = (lvs, { autoSave, old, map }) => {
	if (raw_dat) err("Error", `Dat cannot be loaded multiple times.`)
	raw_dat = {}

	old ??= GM_listValues().reduce((o, k) => (
		o[k] = op.get(k), o
	), {})

	if (autoSave) window.addEventListener("beforeunload", () => save_dat())

	return proxy_dat({
		dat: raw_dat,
		scm: { lvs, rec: 1 },
		map: map ?? (s => s),
		old, oldRoot: old
	})
}

const save_dat = (dat = raw_dat) => {
	Object.keys(dat).forEach(k => op.set(k, JSON.stringify(dat[k])))
}

const clear_dat = () => {
	raw_dat = null
	op.list().forEach(op.del)
}

// Debug
if (location.host === "localhost:1633") Object.assign(unsafeWindow, {
	TM_dat: { type_dat, proxy_dat, load_dat, save_dat, clear_dat, raw_dat: () => raw_dat }
})

