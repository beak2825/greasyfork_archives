/*
This is a copy of the esprima-next library. The jsNode build has been modified to work with userscripts.
*/

/* eslint-disable no-bitwise */
/* eslint-disable default-case-last */
/* eslint-disable no-self-compare */
/* eslint-disable no-multi-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable strict */
/* eslint-disable default-case */
/* eslint-disable no-void */
/* eslint-disable default-param-last */
/* eslint-disable no-continue */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-mixed-operators */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */

// eslint-disable-next-line func-names
const esprima = (function() {
    'use strict';

    const Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        AssignmentPattern: 'AssignmentPattern',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        AwaitExpression: 'AwaitExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ChainExpression: 'ChainExpression',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        Decorator: 'Decorator',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExportAllDeclaration: 'ExportAllDeclaration',
        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
        ExportNamedDeclaration: 'ExportNamedDeclaration',
        ExportSpecifier: 'ExportSpecifier',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForOfStatement: 'ForOfStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        ImportAttribute: 'ImportAttribute',
        ImportExpression: 'ImportExpression',
        ImportDeclaration: 'ImportDeclaration',
        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
        ImportSpecifier: 'ImportSpecifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MetaProperty: 'MetaProperty',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        PrivateIdentifier: 'PrivateIdentifier',
        RestElement: 'RestElement',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SpreadElement: 'SpreadElement',
        StaticBlock: 'StaticBlock',
        Super: 'Super',
        SwitchCase: 'SwitchCase',
        SwitchStatement: 'SwitchStatement',
        TaggedTemplateExpression: 'TaggedTemplateExpression',
        TemplateElement: 'TemplateElement',
        TemplateLiteral: 'TemplateLiteral',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    class CommentHandler {
        attach;
        comments;
        stack;
        leading;
        trailing;
        constructor() {
            this.attach = !1, this.comments = [], this.stack = [], this.leading = [], this.trailing = [];
        }

        insertInnerComments(e, t) {
            if (e.type === 'BlockStatement' && e.body.length === 0) {
                const s = [];
                for (let e = this.leading.length - 1; e >= 0; --e) {
                    const i = this.leading[e];
                    t.end.offset >= i.start && (s.unshift(i.comment), this.leading.splice(e, 1), this.trailing.splice(e, 1));
                }
                s.length && (e.innerComments = s);
            }
        }

        findTrailingComments(e) {
            let t = [];
            if (this.trailing.length > 0) {
                for (let s = this.trailing.length - 1; s >= 0; --s) {
                    const i = this.trailing[s];
                    i.start >= e.end.offset && t.unshift(i.comment);
                }
                return this.trailing.length = 0, t;
            }
            const s = this.stack[this.stack.length - 1];
            if (s && s.node.trailingComments) {
                const i = s.node.trailingComments[0];
                i && i.range[0] >= e.end.offset && (t = s.node.trailingComments, delete s.node.trailingComments);
            }
            return t;
        }

        findLeadingComments(e) {
            const t = [];
            let s;
            for (; this.stack.length > 0;) {
                const t = this.stack[this.stack.length - 1];
                if (!(t && t.start >= e.start.offset)) break;
                s = t.node, this.stack.pop();
            }
            if (s) {
                for (let i = (s.leadingComments ? s.leadingComments.length : 0) - 1; i >= 0; --i) {
                    const r = s.leadingComments[i];
                    r.range[1] <= e.start.offset && (t.unshift(r), s.leadingComments.splice(i, 1));
                }
                return s.leadingComments && s.leadingComments.length === 0 && delete s.leadingComments, t;
            }
            for (let s = this.leading.length - 1; s >= 0; --s) {
                const i = this.leading[s];
                i.start <= e.start.offset && (t.unshift(i.comment), this.leading.splice(s, 1));
            }
            return t;
        }

        visitNode(e, t) {
            if (e.type === 'Program' && e.body.length > 0) return;
            this.insertInnerComments(e, t);
            const s = this.findTrailingComments(t);
            const i = this.findLeadingComments(t);
            i.length > 0 && (e.leadingComments = i), s.length > 0 && (e.trailingComments = s), this.stack.push({
                node: e,
                start: t.start.offset
            });
        }

        visitComment(e, t) {
            const s = e.type[0] === 'L' ? 'Line' : 'Block';
            const i = {
                type: s,
                value: e.value
            };
            if (e.range && (i.range = e.range), e.loc && (i.loc = e.loc), this.comments.push(i), this.attach) {
                const i = {
                    comment: {
                        type: s,
                        value: e.value,
                        range: [t.start.offset, t.end.offset]
                    },
                    start: t.start.offset
                };
                e.loc && (i.comment.loc = e.loc), e.type = s, this.leading.push(i), this.trailing.push(i);
            }
        }

        visit(e, t) {
            e.type === 'LineComment' || e.type === 'BlockComment' ? this.visitComment(e, t) : this.attach && this.visitNode(e, t);
        }
    }

    const Regex = {
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7C6\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB67\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDEC0-\uDEEB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/,
        // eslint-disable-next-line no-misleading-character-class
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D3-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7C6\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB67\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDD30-\uDD39\uDF00-\uDF1C\uDF27\uDF30-\uDF50\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD46\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E\uDC5F\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCE9\uDCFF\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    const Character = {
        fromCodePoint: e => (e < 65536 ? String.fromCharCode(e) : String.fromCharCode(55296 + (e - 65536 >> 10)) + String.fromCharCode(56320 + (e - 65536 & 1023))),
        isStringWellFormedUnicode(e) {
            for (let t = 0; t < e.length; t++) {
                let s = e.charCodeAt(t);
                if (s >= 55296 && s <= 56319) {
                    if (t === e.length - 1) return !1;
                    if (t++, s = e.charCodeAt(t), s < 56320 && s > 57343) return !1;
                } else if (s >= 56320 && s <= 57343) return !1;
            }
            return !0;
        },
        isWhiteSpace: e => e === 32 || e === 9 || e === 11 || e === 12 || e === 160 || e >= 5760 && [5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 65279].indexOf(e) >= 0,
        isLineTerminator: e => e === 10 || e === 13 || e === 8232 || e === 8233,
        isIdentifierStart: e => e === 36 || e === 95 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 92 || e >= 128 && Regex.NonAsciiIdentifierStart.test(Character.fromCodePoint(e)),
        isIdentifierPart: e => e === 36 || e === 95 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 92 || e >= 128 && Regex.NonAsciiIdentifierPart.test(Character.fromCodePoint(e)),
        isDecimalDigit: e => e >= 48 && e <= 57,
        isDecimalDigitChar: e => e.length === 1 && Character.isDecimalDigit(e.charCodeAt(0)),
        isHexDigit: e => e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102,
        isHexDigitChar: e => e.length === 1 && Character.isHexDigit(e.charCodeAt(0)),
        isOctalDigit: e => e >= 48 && e <= 55,
        isOctalDigitChar: e => e.length === 1 && Character.isOctalDigit(e.charCodeAt(0))
    };

    class JSXClosingElement {
        type;
        name;
        constructor(e) {
            this.type = 'JSXClosingElement', this.name = e;
        }
    }

    const JSXClosingFragment = class {
        type;
        constructor() {
            this.type = 'JSXClosingFragment';
        }
    };

    const JSXElement = class {
        type;
        openingElement;
        children;
        closingElement;
        constructor(e, t, s) {
            this.type = 'JSXElement', this.openingElement = e, this.children = t, this.closingElement = s;
        }
    };

    const JSXEmptyExpression = class {
        type;
        constructor() {
            this.type = 'JSXEmptyExpression';
        }
    };

    const JSXExpressionContainer = class {
        type;
        expression;
        constructor(e) {
            this.type = 'JSXExpressionContainer', this.expression = e;
        }
    };

    const JSXIdentifier = class {
        type;
        name;
        constructor(e) {
            this.type = 'JSXIdentifier', this.name = e;
        }
    };

    const JSXMemberExpression = class {
        type;
        object;
        property;
        constructor(e, t) {
            this.type = 'JSXMemberExpression', this.object = e, this.property = t;
        }
    };

    const JSXAttribute = class {
        type;
        name;
        value;
        constructor(e, t) {
            this.type = 'JSXAttribute', this.name = e, this.value = t;
        }
    };

    const JSXNamespacedName = class {
        type;
        namespace;
        name;
        constructor(e, t) {
            this.type = 'JSXNamespacedName', this.namespace = e, this.name = t;
        }
    };

    const JSXOpeningElement = class {
        type;
        name;
        selfClosing;
        attributes;
        constructor(e, t, s) {
            this.type = 'JSXOpeningElement', this.name = e, this.selfClosing = t, this.attributes = s;
        }
    };

    const JSXOpeningFragment = class {
        type;
        selfClosing;
        constructor(e) {
            this.type = 'JSXOpeningFragment', this.selfClosing = e;
        }
    };

    const JSXSpreadAttribute = class {
        type;
        argument;
        constructor(e) {
            this.type = 'JSXSpreadAttribute', this.argument = e;
        }
    };

    const JSXText = class {
        type;
        value;
        raw;
        constructor(e, t) {
            this.type = 'JSXText', this.value = e, this.raw = t;
        }
    };

    const ArrayExpression = class {
        type;
        elements;
        constructor(e) {
            this.type = 'ArrayExpression', this.elements = e;
        }
    };

    const ArrayPattern = class {
        type;
        elements;
        constructor(e) {
            this.type = 'ArrayPattern', this.elements = e;
        }
    };

    const ArrowFunctionExpression = class {
        type;
        id;
        params;
        body;
        generator;
        expression;
        async;
        constructor(e, t, s, i) {
            this.type = 'ArrowFunctionExpression', this.id = null, this.params = e, this.body = t, this.generator = !1, this.expression = s, this.async = i;
        }
    };

    const AssignmentExpression = class {
        type;
        operator;
        left;
        right;
        constructor(e, t, s) {
            this.type = 'AssignmentExpression', this.operator = e, this.left = t, this.right = s;
        }
    };

    const AssignmentPattern = class {
        type;
        left;
        right;
        constructor(e, t) {
            this.type = 'AssignmentPattern', this.left = e, this.right = t;
        }
    };

    const AsyncFunctionDeclaration = class {
        type;
        id;
        params;
        body;
        generator;
        expression;
        async;
        constructor(e, t, s, i) {
            this.type = 'FunctionDeclaration', this.id = e, this.params = t, this.body = s, this.generator = i, this.expression = !1, this.async = !0;
        }
    };

    const AwaitExpression = class {
        type;
        argument;
        constructor(e) {
            this.type = 'AwaitExpression', this.argument = e;
        }
    };

    const BigIntLiteral = class {
        type;
        value;
        raw;
        bigint;
        constructor(e, t, s) {
            this.type = 'Literal', this.value = e, this.raw = t, this.bigint = s;
        }
    };

    const BinaryExpression = class {
        type;
        operator;
        left;
        right;
        constructor(e, t, s) {
            this.type = 'BinaryExpression', this.operator = e, this.left = t, this.right = s;
        }
    };
    const BlockStatement = class {
        type;
        body;
        constructor(e) {
            this.type = 'BlockStatement', this.body = e;
        }
    };
    const BreakStatement = class {
        type;
        label;
        constructor(e) {
            this.type = 'BreakStatement', this.label = e;
        }
    };
    const CallExpression = class {
        type;
        callee;
        arguments;
        optional;
        constructor(e, t, s) {
            this.type = 'CallExpression', this.callee = e, this.arguments = t, this.optional = s;
        }
    };
    const CatchClause = class {
        type;
        param;
        body;
        constructor(e, t) {
            this.type = 'CatchClause', this.param = e, this.body = t;
        }
    };
    const ChainExpression = class {
        type;
        expression;
        constructor(e) {
            this.type = 'ChainExpression', this.expression = e;
        }
    };
    const ClassBody = class {
        type;
        body;
        constructor(e) {
            this.type = 'ClassBody', this.body = e;
        }
    };
    const ClassDeclaration = class {
        type;
        id;
        superClass;
        body;
        decorators;
        constructor(e, t, s, i) {
            this.type = 'ClassDeclaration', this.id = e, this.superClass = t, this.body = s, this.decorators = i;
        }
    };
    const ClassExpression = class {
        type;
        id;
        superClass;
        body;
        decorators;
        constructor(e, t, s, i) {
            this.type = 'ClassExpression', this.id = e, this.superClass = t, this.body = s, this.decorators = i;
        }
    };
    const ConditionalExpression = class {
        type;
        test;
        consequent;
        alternate;
        constructor(e, t, s) {
            this.type = 'ConditionalExpression', this.test = e, this.consequent = t, this.alternate = s;
        }
    };
    const ContinueStatement = class {
        type;
        label;
        constructor(e) {
            this.type = 'ContinueStatement', this.label = e;
        }
    };
    const DebuggerStatement = class {
        type;
        constructor() {
            this.type = 'DebuggerStatement';
        }
    };
    const Decorator = class {
        type;
        expression;
        constructor(e) {
            this.type = 'Decorator', this.expression = e;
        }
    };
    const Directive = class {
        type;
        expression;
        directive;
        constructor(e, t) {
            this.type = 'ExpressionStatement', this.expression = e, this.directive = t;
        }
    };
    const DoWhileStatement = class {
        type;
        body;
        test;
        constructor(e, t) {
            this.type = 'DoWhileStatement', this.body = e, this.test = t;
        }
    };
    const EmptyStatement = class {
        type;
        constructor() {
            this.type = 'EmptyStatement';
        }
    };
    const ExportAllDeclaration = class {
        type;
        source;
        exported;
        assertions;
        constructor(e, t, s) {
            this.type = 'ExportAllDeclaration', this.source = e, this.exported = t, this.assertions = s;
        }
    };
    const ExportDefaultDeclaration = class {
        type;
        declaration;
        constructor(e) {
            this.type = 'ExportDefaultDeclaration', this.declaration = e;
        }
    };
    const ExportNamedDeclaration = class {
        type;
        declaration;
        specifiers;
        source;
        assertions;
        constructor(e, t, s, i) {
            this.type = 'ExportNamedDeclaration', this.declaration = e, this.specifiers = t, this.source = s, this.assertions = i;
        }
    };
    const ExportSpecifier = class {
        type;
        exported;
        local;
        constructor(e, t) {
            this.type = 'ExportSpecifier', this.exported = t, this.local = e;
        }
    };
    const ExpressionStatement = class {
        type;
        expression;
        constructor(e) {
            this.type = 'ExpressionStatement', this.expression = e;
        }
    };
    const ForInStatement = class {
        type;
        left;
        right;
        body;
        each;
        constructor(e, t, s) {
            this.type = 'ForInStatement', this.left = e, this.right = t, this.body = s, this.each = !1;
        }
    };
    const ForOfStatement = class {
        type;
        await;
        left;
        right;
        body;
        constructor(e, t, s, i) {
            this.type = 'ForOfStatement', this.await = i, this.left = e, this.right = t, this.body = s;
        }
    };
    const ForStatement = class {
        type;
        init;
        test;
        update;
        body;
        constructor(e, t, s, i) {
            this.type = 'ForStatement', this.init = e, this.test = t, this.update = s, this.body = i;
        }
    };
    const FunctionDeclaration = class {
        type;
        id;
        params;
        body;
        generator;
        expression;
        async;
        constructor(e, t, s, i) {
            this.type = 'FunctionDeclaration', this.id = e, this.params = t, this.body = s, this.generator = i, this.expression = !1, this.async = !1;
        }
    };
    const FunctionExpression = class {
        type;
        id;
        params;
        body;
        generator;
        expression;
        async;
        constructor(e, t, s, i, r) {
            this.type = 'FunctionExpression', this.id = e, this.params = t, this.body = s, this.generator = i, this.expression = !1, this.async = r;
        }
    };
    const Identifier = class {
        type;
        name;
        constructor(e) {
            this.type = 'Identifier', this.name = e;
        }
    };
    const IfStatement = class {
        type;
        test;
        consequent;
        alternate;
        constructor(e, t, s) {
            this.type = 'IfStatement', this.test = e, this.consequent = t, this.alternate = s;
        }
    };
    const ImportAttribute = class {
        type;
        key;
        value;
        constructor(e, t) {
            this.type = 'ImportAttribute', this.key = e, this.value = t;
        }
    };
    const ImportExpression = class {
        type;
        source;
        attributes;
        constructor(e, t) {
            this.type = 'ImportExpression', this.source = e, this.attributes = t;
        }
    };
    const ImportDeclaration = class {
        type;
        specifiers;
        source;
        assertions;
        constructor(e, t, s) {
            this.type = 'ImportDeclaration', this.specifiers = e, this.source = t, this.assertions = s;
        }
    };
    const ImportDefaultSpecifier = class {
        type;
        local;
        constructor(e) {
            this.type = 'ImportDefaultSpecifier', this.local = e;
        }
    };
    const ImportNamespaceSpecifier = class {
        type;
        local;
        constructor(e) {
            this.type = 'ImportNamespaceSpecifier', this.local = e;
        }
    };
    const ImportSpecifier = class {
        type;
        local;
        imported;
        constructor(e, t) {
            this.type = 'ImportSpecifier', this.local = e, this.imported = t;
        }
    };
    const LabeledStatement = class {
        type;
        label;
        body;
        constructor(e, t) {
            this.type = 'LabeledStatement', this.label = e, this.body = t;
        }
    };
    const Literal = class {
        type;
        value;
        raw;
        constructor(e, t) {
            this.type = 'Literal', this.value = e, this.raw = t;
        }
    };
    const LogicalExpression = class {
        type;
        operator;
        left;
        right;
        constructor(e, t, s) {
            this.type = 'LogicalExpression', this.operator = e, this.left = t, this.right = s;
        }
    };
    const MemberExpression = class {
        type;
        computed;
        object;
        property;
        optional;
        constructor(e, t, s, i) {
            this.type = 'MemberExpression', this.computed = e, this.object = t, this.property = s, this.optional = i;
        }
    };
    const MetaProperty = class {
        type;
        meta;
        property;
        constructor(e, t) {
            this.type = 'MetaProperty', this.meta = e, this.property = t;
        }
    };
    const MethodDefinition = class {
        type;
        key;
        computed;
        value;
        kind;
        static;
        decorators;
        constructor(e, t, s, i, r, n) {
            this.type = 'MethodDefinition', this.key = e, this.computed = t, this.value = s, this.kind = i, this.static = r, this.decorators = n;
        }
    };
    const Module = class {
        type;
        body;
        sourceType;
        constructor(e) {
            this.type = 'Program', this.body = e, this.sourceType = 'module';
        }
    };
    const NewExpression = class {
        type;
        callee;
        arguments;
        constructor(e, t) {
            this.type = 'NewExpression', this.callee = e, this.arguments = t;
        }
    };
    const ObjectExpression = class {
        type;
        properties;
        constructor(e) {
            this.type = 'ObjectExpression', this.properties = e;
        }
    };
    const ObjectPattern = class {
        type;
        properties;
        constructor(e) {
            this.type = 'ObjectPattern', this.properties = e;
        }
    };
    const PrivateIdentifier = class {
        type;
        name;
        constructor(e) {
            this.type = 'PrivateIdentifier', this.name = e;
        }
    };
    const Program = class {
        type;
        body;
        sourceType;
        constructor(e, t) {
            this.type = 'Program', this.sourceType = e, this.body = t;
        }
    };
    const Property = class {
        type;
        key;
        computed;
        value;
        kind;
        method;
        shorthand;
        constructor(e, t, s, i, r, n) {
            this.type = 'Property', this.key = t, this.computed = s, this.value = i, this.kind = e, this.method = r, this.shorthand = n;
        }
    };
    const PropertyDefinition = class {
        type;
        key;
        computed;
        value;
        static;
        decorators;
        constructor(e, t, s, i, r) {
            this.type = 'Property', this.key = e, this.computed = t, this.value = s, this.static = i, this.decorators = r;
        }
    };
    const RegexLiteral = class {
        type;
        value;
        raw;
        regex;
        constructor(e, t, s, i) {
            this.type = 'Literal', this.value = e, this.raw = t, this.regex = {
                pattern: s,
                flags: i
            };
        }
    };
    const RestElement = class {
        type;
        argument;
        constructor(e) {
            this.type = 'RestElement', this.argument = e;
        }
    };
    const ReturnStatement = class {
        type;
        argument;
        constructor(e) {
            this.type = 'ReturnStatement', this.argument = e;
        }
    };
    const Script = class {
        type;
        body;
        sourceType;
        constructor(e) {
            this.type = 'Program', this.body = e, this.sourceType = 'script';
        }
    };
    const SequenceExpression = class {
        type;
        expressions;
        constructor(e) {
            this.type = 'SequenceExpression', this.expressions = e;
        }
    };
    const SpreadElement = class {
        type;
        argument;
        constructor(e) {
            this.type = 'SpreadElement', this.argument = e;
        }
    };
    const StaticBlock = class {
        type;
        body;
        constructor(e) {
            this.type = 'StaticBlock', this.body = e;
        }
    };
    const Super = class {
        type;
        constructor() {
            this.type = 'Super';
        }
    };
    const SwitchCase = class {
        type;
        test;
        consequent;
        constructor(e, t) {
            this.type = 'SwitchCase', this.test = e, this.consequent = t;
        }
    };
    const SwitchStatement = class {
        type;
        discriminant;
        cases;
        constructor(e, t) {
            this.type = 'SwitchStatement', this.discriminant = e, this.cases = t;
        }
    };
    const TaggedTemplateExpression = class {
        type;
        tag;
        quasi;
        constructor(e, t) {
            this.type = 'TaggedTemplateExpression', this.tag = e, this.quasi = t;
        }
    };
    const TemplateElement = class {
        type;
        value;
        tail;
        constructor(e, t) {
            this.type = 'TemplateElement', this.value = e, this.tail = t;
        }
    };
    const TemplateLiteral = class {
        type;
        quasis;
        expressions;
        constructor(e, t) {
            this.type = 'TemplateLiteral', this.quasis = e, this.expressions = t;
        }
    };
    const ThisExpression = class {
        type;
        constructor() {
            this.type = 'ThisExpression';
        }
    };
    const ThrowStatement = class {
        type;
        argument;
        constructor(e) {
            this.type = 'ThrowStatement', this.argument = e;
        }
    };
    const TryStatement = class {
        type;
        block;
        handler;
        finalizer;
        constructor(e, t, s) {
            this.type = 'TryStatement', this.block = e, this.handler = t, this.finalizer = s;
        }
    };
    const UnaryExpression = class {
        type;
        operator;
        argument;
        prefix;
        constructor(e, t) {
            this.type = 'UnaryExpression', this.operator = e, this.argument = t, this.prefix = !0;
        }
    };
    const UpdateExpression = class {
        type;
        operator;
        argument;
        prefix;
        constructor(e, t, s) {
            this.type = 'UpdateExpression', this.operator = e, this.argument = t, this.prefix = s;
        }
    };
    const VariableDeclaration = class {
        type;
        declarations;
        kind;
        constructor(e, t) {
            this.type = 'VariableDeclaration', this.declarations = e, this.kind = t;
        }
    };
    const VariableDeclarator = class {
        type;
        id;
        init;
        constructor(e, t) {
            this.type = 'VariableDeclarator', this.id = e, this.init = t;
        }
    };
    const WhileStatement = class {
        type;
        test;
        body;
        constructor(e, t) {
            this.type = 'WhileStatement', this.test = e, this.body = t;
        }
    };
    const WithStatement = class {
        type;
        object;
        body;
        constructor(e, t) {
            this.type = 'WithStatement', this.object = e, this.body = t;
        }
    };
    const YieldExpression = class {
        type;
        argument;
        delegate;
        constructor(e, t) {
            this.type = 'YieldExpression', this.argument = e, this.delegate = t;
        }
    };

    function assert(e, t) {
        if (!e) throw new Error(`ASSERT: ${t}`);
    }
    const ErrorHandler = class {
        errors;
        tolerant;
        constructor() {
            this.errors = [], this.tolerant = !1;
        }

        recordError(e) {
            this.errors.push(e);
        }

        tolerate(e) {
            if (!this.tolerant) throw e;
            this.recordError(e);
        }

        constructError(e, t) {
            let s = new Error(e);
            try {
                throw s;
            } catch (e) {
                Object.create && Object.defineProperty && (s = Object.create(e), Object.defineProperty(s, 'column', {
                    value: t
                }));
            }
            return s;
        }

        createError(e, t, s, i) {
            const r = `Line ${t}: ${i}`;
            const n = this.constructError(r, s);
            n.index = e, n.lineNumber = t, n.description = i;
            return n;
        }

        throwError(e, t, s, i) {
            throw this.createError(e, t, s, i);
        }

        tolerateError(e, t, s, i) {
            const r = this.createError(e, t, s, i);
            if (!this.tolerant) throw r;
            this.recordError(r);
        }
    };
    const Messages = {
        AsyncFunctionInSingleStatementContext: 'Async functions can only be declared at the top level or inside a block.',
        BadImportCallArity: 'Unexpected token',
        BadGetterArity: 'Getter must not have any formal parameters',
        BadSetterArity: 'Setter must have exactly one formal parameter',
        BadSetterRestParameter: 'Setter function argument must not be a rest parameter',
        CannotUseImportMetaOutsideAModule: "Cannot use 'import.meta' outside a module",
        ConstructorIsAsync: 'Class constructor may not be an async method',
        ConstructorIsPrivate: 'Class constructor may not be a private method',
        ConstructorSpecialMethod: 'Class constructor may not be an accessor',
        DeclarationMissingInitializer: 'Missing initializer in %0 declaration',
        DefaultRestParameter: 'Unexpected token =',
        DefaultRestProperty: 'Unexpected token =',
        DuplicateBinding: 'Duplicate binding %0',
        DuplicateConstructor: 'A class may only have one constructor',
        DuplicateParameter: 'Duplicate parameter name not allowed in this context',
        DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
        ForInOfLoopInitializer: '%0 loop variable declaration may not have an initializer',
        GeneratorInLegacyContext: 'Generator declarations are not allowed in legacy contexts',
        IllegalBreak: 'Illegal break statement',
        IllegalContinue: 'Illegal continue statement',
        IllegalExportDeclaration: 'Unexpected token',
        IllegalImportDeclaration: 'Unexpected token',
        IllegalLanguageModeDirective: "Illegal 'use strict' directive in function with non-simple parameter list",
        IllegalReturn: 'Illegal return statement',
        InvalidEscapedReservedWord: 'Keyword must not contain escaped characters',
        InvalidHexEscapeSequence: 'Invalid hexadecimal escape sequence',
        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
        InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
        InvalidModuleSpecifier: 'Unexpected token',
        InvalidRegExp: 'Invalid regular expression',
        InvalidTaggedTemplateOnOptionalChain: 'Invalid tagged template on optional chain',
        InvalidUnicodeEscapeSequence: 'Invalid Unicode escape sequence',
        LetInLexicalBinding: 'let is disallowed as a lexically bound name',
        MissingFromClause: 'Unexpected token',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NewlineAfterThrow: 'Illegal newline after throw',
        NoAsAfterImportNamespace: 'Unexpected token',
        NoAsAndFromEscapeSequences: 'The `as` and `from` contextual keywords must not contain Unicode escape sequences.',
        NoCatchOrFinally: 'Missing catch or finally after try',
        NoSemicolonAfterDecorator: 'Decorators must not be followed by a semicolon.',
        NumericSeperatorOneUnderscore: 'Numeric separator must be exactly one underscore',
        NumericSeperatorNotAllowedHere: 'Numeric separator is not allowed here',
        ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
        PropertyAfterRestProperty: 'Unexpected token',
        Redeclaration: "%0 '%1' has already been declared",
        StaticPrototype: 'Classes may not have static property named prototype',
        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
        StrictFunction: 'In strict mode code, functions can only be declared at top level or inside a block',
        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictModeWith: 'Strict mode code may not include a with statement',
        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
        StrictReservedWord: 'Use of future reserved word in strict mode',
        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
        TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
        TemplateEscape89: '\\8 and \\9 are not allowed in template strings.',
        UnexpectedEOS: 'Unexpected end of input',
        UnexpectedIdentifier: 'Unexpected identifier',
        UnexpectedNumber: 'Unexpected number',
        UnexpectedReserved: 'Unexpected reserved word',
        UnexpectedString: 'Unexpected string',
        UnexpectedSuper: "'super' keyword unexpected here",
        UnexpectedTemplate: 'Unexpected quasi %0',
        UnexpectedToken: 'Unexpected token %0',
        UnexpectedTokenIllegal: 'Unexpected token ILLEGAL',
        UnknownLabel: "Undefined label '%0'",
        UnterminatedRegExp: 'Invalid regular expression: missing /'
    };
    const TokenName = {};

    function hexValue(e) {
        return '0123456789abcdef'.indexOf(e.toLowerCase());
    }

    function octalValue(e) {
        return '01234567'.indexOf(e);
    }
    TokenName[1] = 'Boolean', TokenName[2] = '<end>', TokenName[3] = 'Identifier', TokenName[4] = 'Keyword', TokenName[5] = 'Null', TokenName[6] = 'Numeric', TokenName[7] = 'Punctuator', TokenName[8] = 'String', TokenName[9] = 'RegularExpression', TokenName[10] = 'Template';
    const Scanner = class {
        source;
        errorHandler;
        trackComment;
        isModule;
        index;
        lineNumber;
        lineStart;
        curlyStack;
        length;
        constructor(e, t) {
            this.source = e, this.errorHandler = t, this.trackComment = !1, this.isModule = !1, this.length = e.length, this.index = 0, this.lineNumber = e.length > 0 ? 1 : 0, this.lineStart = 0, this.curlyStack = [];
        }

        saveState() {
            return {
                index: this.index,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                curlyStack: this.curlyStack.slice()
            };
        }

        restoreState(e) {
            this.index = e.index, this.lineNumber = e.lineNumber, this.lineStart = e.lineStart, this.curlyStack = e.curlyStack;
        }

        eof() {
            return this.index >= this.length;
        }

        throwUnexpectedToken(e = Messages.UnexpectedTokenIllegal) {
            return this.errorHandler.throwError(this.index, this.lineNumber, this.index - this.lineStart + 1, e);
        }

        tolerateUnexpectedToken(e = Messages.UnexpectedTokenIllegal) {
            this.errorHandler.tolerateError(this.index, this.lineNumber, this.index - this.lineStart + 1, e);
        }

        skipSingleLineComment(e) {
            let t; let s; let
                i = [];
            for (this.trackComment && (i = [], t = this.index - e, s = {
                start: {
                    line: this.lineNumber,
                    column: this.index - this.lineStart - e
                },
                end: {}
            }); !this.eof();) {
                const r = this.source.charCodeAt(this.index);
                if (++this.index, Character.isLineTerminator(r)) {
                    if (this.trackComment) {
                        s.end = {
                            line: this.lineNumber,
                            column: this.index - this.lineStart - 1
                        };
                        const r = {
                            multiLine: !1,
                            slice: [t + e, this.index - 1],
                            range: [t, this.index - 1],
                            loc: s
                        };
                        i.push(r);
                    }
                    return r === 13 && this.source.charCodeAt(this.index) === 10 && ++this.index, ++this.lineNumber, this.lineStart = this.index, i;
                }
            }
            if (this.trackComment) {
                s.end = {
                    line: this.lineNumber,
                    column: this.index - this.lineStart
                };
                const r = {
                    multiLine: !1,
                    slice: [t + e, this.index],
                    range: [t, this.index],
                    loc: s
                };
                i.push(r);
            }
            return i;
        }

        skipMultiLineComment() {
            let e; let t; let
                s = [];
            for (this.trackComment && (s = [], e = this.index - 2, t = {
                start: {
                    line: this.lineNumber,
                    column: this.index - this.lineStart - 2
                },
                end: {}
            }); !this.eof();) {
                const i = this.source.charCodeAt(this.index);
                if (Character.isLineTerminator(i)) i === 13 && this.source.charCodeAt(this.index + 1) === 10 && ++this.index, ++this.lineNumber, ++this.index, this.lineStart = this.index;
                else if (i === 42) {
                    if (this.source.charCodeAt(this.index + 1) === 47) {
                        if (this.index += 2, this.trackComment) {
                            t.end = {
                                line: this.lineNumber,
                                column: this.index - this.lineStart
                            };
                            const i = {
                                multiLine: !0,
                                slice: [e + 2, this.index - 2],
                                range: [e, this.index],
                                loc: t
                            };
                            s.push(i);
                        }
                        return s;
                    }++this.index;
                } else ++this.index;
            }
            if (this.trackComment) {
                t.end = {
                    line: this.lineNumber,
                    column: this.index - this.lineStart
                };
                const i = {
                    multiLine: !0,
                    slice: [e + 2, this.index],
                    range: [e, this.index],
                    loc: t
                };
                s.push(i);
            }
            return this.tolerateUnexpectedToken(), s;
        }

        scanComments() {
            let e;
            this.trackComment && (e = []);
            let t = this.index === 0;
            for (; !this.eof();) {
                let s = this.source.charCodeAt(this.index);
                if (Character.isWhiteSpace(s)) ++this.index;
                else if (Character.isLineTerminator(s)) ++this.index, s === 13 && this.source.charCodeAt(this.index) === 10 && ++this.index, ++this.lineNumber, this.lineStart = this.index, t = !0;
                else if (s === 47) {
                    if (s = this.source.charCodeAt(this.index + 1), s === 47) {
                        this.index += 2;
                        const s = this.skipSingleLineComment(2);
                        this.trackComment && (e = e.concat(s)), t = !0;
                    } else {
                        if (s !== 42) break;
                        {
                            this.index += 2;
                            const t = this.skipMultiLineComment();
                            this.trackComment && (e = e.concat(t));
                        }
                    }
                } else if (t && s === 45) {
                    if (this.source.charCodeAt(this.index + 1) !== 45 || this.source.charCodeAt(this.index + 2) !== 62) break;
                    {
                        this.index += 3;
                        const t = this.skipSingleLineComment(3);
                        this.trackComment && (e = e.concat(t));
                    }
                } else {
                    if (s !== 60 || this.isModule) break;
                    if (this.source.slice(this.index + 1, this.index + 4) !== '!--') break;
                    {
                        this.index += 4;
                        const t = this.skipSingleLineComment(4);
                        this.trackComment && (e = e.concat(t));
                    }
                }
            }
            return e;
        }

        isFutureReservedWord(e) {
            switch (e) {
                case 'enum':
                case 'export':
                case 'import':
                case 'super':
                    return !0;
                default:
                    return !1;
            }
        }

        isStrictModeReservedWord(e) {
            switch (e) {
                case 'implements':
                case 'interface':
                case 'package':
                case 'private':
                case 'protected':
                case 'public':
                case 'static':
                case 'yield':
                case 'let':
                    return !0;
                default:
                    return !1;
            }
        }

        isRestrictedWord(e) {
            return e === 'eval' || e === 'arguments';
        }

        isKeyword(e) {
            switch (e.length) {
                case 2:
                    return e === 'if' || e === 'in' || e === 'do';
                case 3:
                    return e === 'var' || e === 'for' || e === 'new' || e === 'try' || e === 'let';
                case 4:
                    return e === 'this' || e === 'else' || e === 'case' || e === 'void' || e === 'with' || e === 'enum';
                case 5:
                    return e === 'while' || e === 'break' || e === 'catch' || e === 'throw' || e === 'const' || e === 'yield' || e === 'class' || e === 'super';
                case 6:
                    return e === 'return' || e === 'typeof' || e === 'delete' || e === 'switch' || e === 'export' || e === 'import';
                case 7:
                    return e === 'default' || e === 'finally' || e === 'extends';
                case 8:
                    return e === 'function' || e === 'continue' || e === 'debugger';
                case 10:
                    return e === 'instanceof';
                default:
                    return !1;
            }
        }

        codePointAt(e) {
            let t = this.source.charCodeAt(e);
            if (t >= 55296 && t <= 56319) {
                const s = this.source.charCodeAt(e + 1);
                if (s >= 56320 && s <= 57343) {
                    t = 1024 * (t - 55296) + s - 56320 + 65536;
                }
            }
            return t;
        }

        scanHexEscape(e) {
            const t = e === 'u' ? 4 : 2;
            let s = 0;
            for (let e = 0; e < t; ++e) {
                if (this.eof() || !Character.isHexDigit(this.source.charCodeAt(this.index))) return null;
                s = 16 * s + hexValue(this.source[this.index++]);
            }
            return String.fromCharCode(s);
        }

        tryToScanUnicodeCodePointEscape() {
            let e = this.source[this.index];
            let t = 0;
            if (e === '}') return null;
            for (; !this.eof() && (e = this.source[this.index++], Character.isHexDigit(e.charCodeAt(0)));) t = 16 * t + hexValue(e);
            return t > 1114111 || e !== '}' ? null : Character.fromCodePoint(t);
        }

        scanUnicodeCodePointEscape() {
            const e = this.tryToScanUnicodeCodePointEscape();
            return e === null ? this.throwUnexpectedToken() : e;
        }

        getIdentifier() {
            const e = this.index++;
            for (; !this.eof();) {
                const t = this.source.charCodeAt(this.index);
                if (t === 92) return this.index = e, this.getComplexIdentifier();
                if (t >= 55296 && t < 57343) return this.index = e, this.getComplexIdentifier();
                if (!Character.isIdentifierPart(t)) break;
                ++this.index;
            }
            return this.source.slice(e, this.index);
        }

        getComplexIdentifier() {
            let e; let t = this.codePointAt(this.index);
            let s = Character.fromCodePoint(t);
            for (this.index += s.length, t === 92 && (this.source.charCodeAt(this.index) !== 117 && this.throwUnexpectedToken(), ++this.index, this.source[this.index] === '{' ? (++this.index, e = this.scanUnicodeCodePointEscape()) : (e = this.scanHexEscape('u'), e !== null && e !== '\\' && Character.isIdentifierStart(e.charCodeAt(0)) || this.throwUnexpectedToken()), s = e); !this.eof() && (t = this.codePointAt(this.index), Character.isIdentifierPart(t));) e = Character.fromCodePoint(t), s += e, this.index += e.length, t === 92 && (s = s.substr(0, s.length - 1), this.source.charCodeAt(this.index) !== 117 && this.throwUnexpectedToken(), ++this.index, this.source[this.index] === '{' ? (++this.index, e = this.scanUnicodeCodePointEscape()) : (e = this.scanHexEscape('u'), e !== null && e !== '\\' && Character.isIdentifierPart(e.charCodeAt(0)) || this.throwUnexpectedToken()), s += e);
            return s;
        }

        octalToDecimal(e) {
            let t = e !== '0';
            let s = octalValue(e);
            return !this.eof() && Character.isOctalDigit(this.source.charCodeAt(this.index)) && (t = !0, s = 8 * s + octalValue(this.source[this.index++]), '0123'.indexOf(e) >= 0 && !this.eof() && Character.isOctalDigit(this.source.charCodeAt(this.index)) && (s = 8 * s + octalValue(this.source[this.index++]))), {
                code: s,
                octal: t
            };
        }

        scanIdentifier() {
            let e;
            const t = this.index;
            const s = this.source.charCodeAt(t) === 92;
            const i = s ? this.getComplexIdentifier() : this.getIdentifier();
            if (e = i.length === 1 ? 3 : this.isKeyword(i) ? 4 : i === 'null' ? 5 : i === 'true' || i === 'false' ? 1 : 3, e !== 3 && t + i.length !== this.index) {
                const e = this.index;
                this.index = t, this.tolerateUnexpectedToken(Messages.InvalidEscapedReservedWord), this.index = e;
            }
            return {
                type: e,
                value: i,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: t,
                end: this.index,
                escaped: s
            };
        }

        scanPunctuator() {
            const e = this.index;
            let t = this.source[this.index];
            switch (t) {
                case '(':
                case '{':
                    t === '{' && this.curlyStack.push('{'), ++this.index;
                    break;
                case '.':
                    ++this.index, this.source[this.index] === '.' && this.source[this.index + 1] === '.' && (this.index += 2, t = '...');
                    break;
                case '}':
                    ++this.index, this.curlyStack.pop();
                    break;
                case '?':
                    ++this.index, this.source[this.index] === '?' && (++this.index, this.source[this.index] === '=' ? (++this.index, t = '??=') : t = '??'), this.source[this.index] !== '.' || /^\d$/.test(this.source[this.index + 1]) || (++this.index, t = '?.');
                    break;
                case '#':
                case ')':
                case ';':
                case ',':
                case '[':
                case ']':
                case ':':
                case '~':
                case '@':
                    ++this.index;
                    break;
                default:
                    t = this.source.substr(this.index, 4), t === '>>>=' ? this.index += 4 : (t = t.substr(0, 3), t === '===' || t === '!==' || t === '>>>' || t === '<<=' || t === '>>=' || t === '**=' || t === '&&=' || t === '||=' ? this.index += 3 : (t = t.substr(0, 2), t === '&&' || t === '||' || t === '==' || t === '!=' || t === '+=' || t === '-=' || t === '*=' || t === '/=' || t === '++' || t === '--' || t === '<<' || t === '>>' || t === '&=' || t === '|=' || t === '^=' || t === '%=' || t === '<=' || t === '>=' || t === '=>' || t === '**' ? this.index += 2 : (t = this.source[this.index], '<>=!+-*%&|^/'.indexOf(t) >= 0 && ++this.index)));
            }
            return this.index === e && this.throwUnexpectedToken(), {
                type: 7,
                value: t,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            };
        }

        scanHexLiteral(e) {
            const t = this.scanLiteralPart(Character.isHexDigitChar);
            return t.length === 0 && this.throwUnexpectedToken(), this.source[this.index] === 'n' ? (this.index++, {
                type: 6,
                value: BigInt(`0x${t}`),
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            }) : (Character.isIdentifierStart(this.source.charCodeAt(this.index)) && this.throwUnexpectedToken(), {
                type: 6,
                value: parseInt(`0x${t}`, 16),
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            });
        }

        scanBinaryLiteral(e) {
            let t; const
                s = this.scanLiteralPart((e => e === '0' || e === '1'));
            return s.length === 0 && this.throwUnexpectedToken(), this.source[this.index] === 'n' ? (this.index++, {
                type: 6,
                value: BigInt(`0b${s}`),
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            }) : (this.eof() || (t = this.source.charCodeAt(this.index), (Character.isIdentifierStart(t) || Character.isDecimalDigit(t)) && this.throwUnexpectedToken()), {
                type: 6,
                value: parseInt(s, 2),
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            });
        }

        scanOctalLiteral(e, t) {
            let s = '';
            let i = !1;
            return Character.isOctalDigit(e.charCodeAt(0)) ? (i = !0, s = `0${this.source[this.index++]}`) : ++this.index, s += this.scanLiteralPart(Character.isOctalDigitChar), i || s.length !== 0 || this.throwUnexpectedToken(), this.source[this.index] === 'n' ? (this.index++, {
                type: 6,
                value: BigInt(`0o${s}`),
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: t,
                end: this.index
            }) : ((Character.isIdentifierStart(this.source.charCodeAt(this.index)) || Character.isDecimalDigit(this.source.charCodeAt(this.index))) && this.throwUnexpectedToken(), {
                type: 6,
                value: parseInt(s, 8),
                octal: i,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: t,
                end: this.index
            });
        }

        isImplicitOctalLiteral() {
            for (let e = this.index + 1; e < this.length; ++e) {
                const t = this.source[e];
                if (t === '8' || t === '9' || t === 'n') return !1;
                if (!Character.isOctalDigit(t.charCodeAt(0))) return !0;
            }
            return !0;
        }

        scanLiteralPart(e) {
            let t = '';
            for (this.source[this.index] === '_' && this.throwUnexpectedToken(Messages.NumericSeperatorNotAllowedHere); this.source[this.index] && (e(this.source[this.index]) || this.source[this.index] === '_');) this.source[this.index] !== '_' && (t += this.source[this.index]), this.index++, this.source[this.index - 1] === '_' && this.source[this.index] === '_' && this.throwUnexpectedToken(Messages.NumericSeperatorOneUnderscore);
            return this.source[this.index - 1] === '_' && this.throwUnexpectedToken(Messages.NumericSeperatorNotAllowedHere), t;
        }

        scanNumericLiteral() {
            const e = this.index;
            let t = this.source[e];
            assert(Character.isDecimalDigit(t.charCodeAt(0)) || t === '.', 'Numeric literal must start with a decimal digit or a decimal point');
            let s = '';
            if (t !== '.') {
                if (s = this.source[this.index++], t = this.source[this.index], s === '0') {
                    if (t === 'x' || t === 'X') return ++this.index, this.scanHexLiteral(e);
                    if (t === 'b' || t === 'B') return ++this.index, this.scanBinaryLiteral(e);
                    if (t === 'o' || t === 'O') return this.scanOctalLiteral(t, e);
                    if (t && Character.isOctalDigit(t.charCodeAt(0)) && this.isImplicitOctalLiteral()) return this.scanOctalLiteral(t, e);
                }
                this.index--, s = this.scanLiteralPart(Character.isDecimalDigitChar), t = this.source[this.index];
            }
            if (t === '.' && (s += this.source[this.index++], s += this.scanLiteralPart(Character.isDecimalDigitChar), t = this.source[this.index]), t === 'e' || t === 'E') s += this.source[this.index++], t = this.source[this.index], t !== '+' && t !== '-' || (s += this.source[this.index++]), Character.isDecimalDigit(this.source.charCodeAt(this.index)) ? s += this.scanLiteralPart(Character.isDecimalDigitChar) : this.throwUnexpectedToken();
            else if (t === 'n') {
                return s.length > 1 && s[0] === '0' && this.throwUnexpectedToken(), this.index++, {
                    type: 6,
                    value: BigInt(s),
                    lineNumber: this.lineNumber,
                    lineStart: this.lineStart,
                    start: e,
                    end: this.index
                };
            }
            return Character.isIdentifierStart(this.source.charCodeAt(this.index)) && this.throwUnexpectedToken(), {
                type: 6,
                value: parseFloat(s),
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            };
        }

        scanStringLiteral() {
            const e = this.index;
            let t = this.source[e];
            assert(t === "'" || t === '"', 'String literal must starts with a quote'), ++this.index;
            let s = !1;
            let i = '';
            for (; !this.eof();) {
                let e = this.source[this.index++];
                if (e === t) {
                    t = '';
                    break;
                }
                if (e === '\\') {
                    if (e = this.source[this.index++], e && Character.isLineTerminator(e.charCodeAt(0))) ++this.lineNumber, e === '\r' && this.source[this.index] === '\n' && ++this.index, this.lineStart = this.index;
                    else {
                        switch (e) {
                            case 'u':
                                if (this.source[this.index] === '{') ++this.index, i += this.scanUnicodeCodePointEscape();
                                else {
                                    const t = this.scanHexEscape(e);
                                    t === null && this.throwUnexpectedToken(), i += t;
                                }
                                break;
                            case 'x':
                                const t = this.scanHexEscape(e);
                                t === null && this.throwUnexpectedToken(Messages.InvalidHexEscapeSequence), i += t;
                                break;
                            case 'n':
                                i += '\n';
                                break;
                            case 'r':
                                i += '\r';
                                break;
                            case 't':
                                i += '\t';
                                break;
                            case 'b':
                                i += '\b';
                                break;
                            case 'f':
                                i += '\f';
                                break;
                            case 'v':
                                i += '\v';
                                break;
                            case '8':
                            case '9':
                                i += e, this.tolerateUnexpectedToken();
                                break;
                            default:
                                if (e && Character.isOctalDigit(e.charCodeAt(0))) {
                                    const t = this.octalToDecimal(e);
                                    s = t.octal || s, i += String.fromCharCode(t.code);
                                } else i += e;
                        }
                    }
                } else {
                    if (Character.isLineTerminator(e.charCodeAt(0))) break;
                    i += e;
                }
            }
            return t !== '' && (this.index = e, this.throwUnexpectedToken()), {
                type: 8,
                value: i,
                octal: s,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            };
        }

        scanTemplate() {
            let e = '';
            let t = !1;
            const s = this.index;
            const i = this.source[s] === '`';
            let r = !1;
            let n = null;
            let a = 2;
            for (++this.index; !this.eof();) {
                let s = this.source[this.index++];
                if (s === '`') {
                    a = 1, r = !0, t = !0;
                    break;
                }
                if (s === '$') {
                    if (this.source[this.index] === '{') {
                        this.curlyStack.push('${'), ++this.index, t = !0;
                        break;
                    }
                    e += s;
                } else {
                    if (n !== null) continue;
                    if (s === '\\') {
                        if (s = this.source[this.index++], Character.isLineTerminator(s.charCodeAt(0))) ++this.lineNumber, s === '\r' && this.source[this.index] === '\n' && ++this.index, this.lineStart = this.index;
                        else {
                            switch (s) {
                                case 'n':
                                    e += '\n';
                                    break;
                                case 'r':
                                    e += '\r';
                                    break;
                                case 't':
                                    e += '\t';
                                    break;
                                case 'u':
                                    if (this.source[this.index] === '{') {
                                        ++this.index;
                                        const t = this.tryToScanUnicodeCodePointEscape();
                                        t === null ? n = 'u' : e += t;
                                    } else {
                                        const t = this.scanHexEscape(s);
                                        t === null ? n = 'u' : e += t;
                                    }
                                    break;
                                case 'x':
                                    const t = this.scanHexEscape(s);
                                    t === null ? n = 'x' : e += t;
                                    break;
                                case 'b':
                                    e += '\b';
                                    break;
                                case 'f':
                                    e += '\f';
                                    break;
                                case 'v':
                                    e += '\v';
                                    break;
                                default:
                                    s === '0' ? Character.isDecimalDigit(this.source.charCodeAt(this.index)) ? n = '0' : e += '\0' : Character.isDecimalDigitChar(s) ? n = s : e += s;
                            }
                        }
                    } else Character.isLineTerminator(s.charCodeAt(0)) ? (++this.lineNumber, s === '\r' && this.source[this.index] === '\n' && ++this.index, this.lineStart = this.index, e += '\n') : e += s;
                }
            }
            return t || this.throwUnexpectedToken(), i || this.curlyStack.pop(), {
                type: 10,
                value: this.source.slice(s + 1, this.index - a),
                cooked: n === null ? e : null,
                head: i,
                tail: r,
                notEscapeSequenceHead: n,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: s,
                end: this.index
            };
        }

        testRegExp(e, t) {
            let s = e;
            t.indexOf('u') >= 0 && (s = s.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, ((e, t, s) => {
                const i = parseInt(t || s, 16);
                return i > 1114111 && this.throwUnexpectedToken(Messages.InvalidRegExp), i <= 65535 ? String.fromCharCode(i) : '￿';
            })).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '￿'));
            try {
                RegExp(s);
            } catch (e) {
                this.throwUnexpectedToken(Messages.InvalidRegExp);
            }
            try {
                return new RegExp(e, t);
            } catch (e) {
                return null;
            }
        }

        scanRegExpBody() {
            let e = this.source[this.index];
            assert(e === '/', 'Regular expression literal must start with a slash');
            let t = this.source[this.index++];
            let s = !1;
            let i = !1;
            for (; !this.eof();) {
                if (e = this.source[this.index++], t += e, e === '\\') e = this.source[this.index++], Character.isLineTerminator(e.charCodeAt(0)) && this.throwUnexpectedToken(Messages.UnterminatedRegExp), t += e;
                else if (Character.isLineTerminator(e.charCodeAt(0))) this.throwUnexpectedToken(Messages.UnterminatedRegExp);
                else if (s) e === ']' && (s = !1);
                else {
                    if (e === '/') {
                        i = !0;
                        break;
                    }
                    e === '[' && (s = !0);
                }
            }
            return i || this.throwUnexpectedToken(Messages.UnterminatedRegExp), t.substr(1, t.length - 2);
        }

        scanRegExpFlags() {
            let e = '';
            let t = '';
            for (; !this.eof();) {
                let s = this.source[this.index];
                if (!Character.isIdentifierPart(s.charCodeAt(0))) break;
                if (++this.index, s !== '\\' || this.eof()) t += s, e += s;
                else if (s = this.source[this.index], s === 'u') {
                    ++this.index;
                    let s = this.index;
                    const i = this.scanHexEscape('u');
                    if (i !== null) for (t += i, e += '\\u'; s < this.index; ++s) e += this.source[s];
                    else this.index = s, t += 'u', e += '\\u';
                    this.tolerateUnexpectedToken();
                } else e += '\\', this.tolerateUnexpectedToken();
            }
            return t;
        }

        scanRegExp() {
            const e = this.index;
            const t = this.scanRegExpBody();
            const s = this.scanRegExpFlags();
            return {
                type: 9,
                value: '',
                pattern: t,
                flags: s,
                regex: this.testRegExp(t, s),
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: e,
                end: this.index
            };
        }

        lex() {
            if (this.eof()) {
                return {
                    type: 2,
                    value: '',
                    lineNumber: this.lineNumber,
                    lineStart: this.lineStart,
                    start: this.index,
                    end: this.index
                };
            }
            const e = this.source.charCodeAt(this.index);
            return Character.isIdentifierStart(e) ? this.scanIdentifier() : e === 40 || e === 41 || e === 59 ? this.scanPunctuator() : e === 39 || e === 34 ? this.scanStringLiteral() : e === 46 ? Character.isDecimalDigit(this.source.charCodeAt(this.index + 1)) ? this.scanNumericLiteral() : this.scanPunctuator() : Character.isDecimalDigit(e) ? this.scanNumericLiteral() : e === 96 || e === 125 && this.curlyStack[this.curlyStack.length - 1] === '${' ? this.scanTemplate() : e >= 55296 && e < 57343 && Character.isIdentifierStart(this.codePointAt(this.index)) ? this.scanIdentifier() : this.scanPunctuator();
        }
    };
    const ArrowParameterPlaceHolder = 'ArrowParameterPlaceHolder';
    const Parser = class {
        config;
        delegate;
        errorHandler;
        scanner;
        operatorPrecedence;
        lookahead;
        hasLineTerminator;
        context;
        tokens;
        startMarker;
        lastMarker;
        constructor(e, t = {}, s) {
            this.config = {
                range: typeof t.range === 'boolean' && t.range,
                loc: typeof t.loc === 'boolean' && t.loc,
                source: null,
                tokens: typeof t.tokens === 'boolean' && t.tokens,
                comment: typeof t.comment === 'boolean' && t.comment,
                tolerant: typeof t.tolerant === 'boolean' && t.tolerant
            }, this.config.loc && t.source && t.source !== null && (this.config.source = String(t.source)), this.delegate = s, this.errorHandler = new ErrorHandler(), this.errorHandler.tolerant = this.config.tolerant == 1, this.scanner = new Scanner(e, this.errorHandler), this.scanner.trackComment = this.config.comment == 1, this.operatorPrecedence = {
                ')': 0,
                ';': 0,
                ',': 0,
                '=': 0,
                ']': 0,
                '??': 5,
                '||': 6,
                '&&': 7,
                '|': 8,
                '^': 9,
                '&': 10,
                '==': 11,
                '!=': 11,
                '===': 11,
                '!==': 11,
                '<': 12,
                '>': 12,
                '<=': 12,
                '>=': 12,
                '<<': 13,
                '>>': 13,
                '>>>': 13,
                '+': 14,
                '-': 14,
                '*': 15,
                '/': 15,
                '%': 15
            }, this.lookahead = {
                type: 2,
                value: '',
                lineNumber: this.scanner.lineNumber,
                lineStart: 0,
                start: 0,
                end: 0
            }, this.hasLineTerminator = !1, this.context = {
                isModule: !1,
                isAsync: !1,
                allowIn: !0,
                allowStrictDirective: !0,
                allowSuper: !1,
                allowYield: !0,
                firstCoverInitializedNameError: null,
                isAssignmentTarget: !1,
                isBindingElement: !1,
                inConstructor: !1,
                inFunctionBody: !1,
                inIteration: !1,
                inSwitch: !1,
                inClassConstructor: !1,
                labelSet: {},
                strict: !1,
                decorators: null
            }, this.tokens = [], this.startMarker = {
                index: 0,
                line: this.scanner.lineNumber,
                column: 0
            }, this.lastMarker = {
                index: 0,
                line: this.scanner.lineNumber,
                column: 0
            }, this.nextToken(), this.lastMarker = {
                index: this.scanner.index,
                line: this.scanner.lineNumber,
                column: this.scanner.index - this.scanner.lineStart
            };
        }

        throwError(e, ...t) {
            const s = t.slice();
            const i = e.replace(/%(\d)/g, ((e, t) => (assert(t < s.length, 'Message reference must be in range'), s[t])));
            const r = this.lastMarker.index;
            const n = this.lastMarker.line;
            const a = this.lastMarker.column + 1;
            throw this.errorHandler.createError(r, n, a, i);
        }

        tolerateError(e, ...t) {
            const s = t.slice();
            const i = e.replace(/%(\d)/g, ((e, t) => (assert(t < s.length, 'Message reference must be in range'), s[t])));
            const r = this.lastMarker.index;
            const n = this.scanner.lineNumber;
            const a = this.lastMarker.column + 1;
            this.errorHandler.tolerateError(r, n, a, i);
        }

        unexpectedTokenError(e, t) {
            let s; let
                i = t || Messages.UnexpectedToken;
            if (e ? (t || (i = e.type === 2 ? Messages.UnexpectedEOS : e.type === 3 ? Messages.UnexpectedIdentifier : e.type === 6 ? Messages.UnexpectedNumber : e.type === 8 ? Messages.UnexpectedString : e.type === 10 ? Messages.UnexpectedTemplate : Messages.UnexpectedToken, e.type === 4 && (this.scanner.isFutureReservedWord(e.value) ? i = Messages.UnexpectedReserved : this.context.strict && this.scanner.isStrictModeReservedWord(e.value) && (i = Messages.StrictReservedWord))), s = e.value) : s = 'ILLEGAL', i = i.replace('%0', s), e && typeof e.lineNumber === 'number') {
                const t = e.start;
                const s = e.lineNumber;
                const r = this.lastMarker.index - this.lastMarker.column;
                const n = e.start - r + 1;
                return this.errorHandler.createError(t, s, n, i);
            } {
                const e = this.lastMarker.index;
                const t = this.lastMarker.line;
                const s = this.lastMarker.column + 1;
                return this.errorHandler.createError(e, t, s, i);
            }
        }

        throwUnexpectedToken(e, t) {
            throw this.unexpectedTokenError(e, t);
        }

        tolerateUnexpectedToken(e, t) {
            this.errorHandler.tolerate(this.unexpectedTokenError(e, t));
        }

        tolerateInvalidLoopStatement() {
            (this.matchKeyword('class') || this.matchKeyword('function')) && this.tolerateError(Messages.UnexpectedToken, this.lookahead);
        }

        collectComments() {
            if (this.config.comment) {
                const e = this.scanner.scanComments();
                if (e.length > 0 && this.delegate) {
                    for (let t = 0; t < e.length; ++t) {
                        const s = e[t];
                        const i = {
                            type: s.multiLine ? 'BlockComment' : 'LineComment',
                            value: this.scanner.source.slice(s.slice[0], s.slice[1])
                        };
                        this.config.range && (i.range = s.range), this.config.loc && (i.loc = s.loc);
                        const r = {
                            start: {
                                line: s.loc.start.line,
                                column: s.loc.start.column,
                                offset: s.range[0]
                            },
                            end: {
                                line: s.loc.end.line,
                                column: s.loc.end.column,
                                offset: s.range[1]
                            }
                        };
                        this.delegate(i, r);
                    }
                }
            } else this.scanner.scanComments();
        }

        getTokenRaw(e) {
            return this.scanner.source.slice(e.start, e.end);
        }

        convertToken(e) {
            const t = {
                type: TokenName[e.type],
                value: this.getTokenRaw(e)
            };
            if (this.config.range && (t.range = [e.start, e.end]), this.config.loc && (t.loc = {
                start: {
                    line: this.startMarker.line,
                    column: this.startMarker.column
                },
                end: {
                    line: this.scanner.lineNumber,
                    column: this.scanner.index - this.scanner.lineStart
                }
            }), e.type === 9) {
                const s = e.pattern;
                const i = e.flags;
                t.regex = {
                    pattern: s,
                    flags: i
                };
            }
            return t;
        }

        nextToken() {
            const e = this.lookahead;
            this.lastMarker.index = this.scanner.index, this.lastMarker.line = this.scanner.lineNumber, this.lastMarker.column = this.scanner.index - this.scanner.lineStart, this.collectComments(), this.scanner.index !== this.startMarker.index && (this.startMarker.index = this.scanner.index, this.startMarker.line = this.scanner.lineNumber, this.startMarker.column = this.scanner.index - this.scanner.lineStart);
            const t = this.scanner.lex();
            return this.hasLineTerminator = e.lineNumber !== t.lineNumber, t && this.context.strict && t.type === 3 && this.scanner.isStrictModeReservedWord(t.value) && (t.type = 4), this.lookahead = t, this.config.tokens && t.type !== 2 && this.tokens.push(this.convertToken(t)), e;
        }

        nextRegexToken() {
            this.collectComments();
            const e = this.scanner.scanRegExp();
            return this.config.tokens && (this.tokens.pop(), this.tokens.push(this.convertToken(e))), this.lookahead = e, this.nextToken(), e;
        }

        createNode() {
            return {
                index: this.startMarker.index,
                line: this.startMarker.line,
                column: this.startMarker.column
            };
        }

        startNode(e, t = 0) {
            let s = e.start - e.lineStart;
            let i = e.lineNumber;
            return s < 0 && (s += t, i--), {
                index: e.start,
                line: i,
                column: s
            };
        }

        finalize(e, t) {
            if (this.config.range && (t.range = [e.index, this.lastMarker.index]), this.config.loc && (t.loc = {
                start: {
                    line: e.line,
                    column: e.column
                },
                end: {
                    line: this.lastMarker.line,
                    column: this.lastMarker.column
                }
            }, this.config.source && (t.loc.source = this.config.source)), this.delegate) {
                const s = {
                    start: {
                        line: e.line,
                        column: e.column,
                        offset: e.index
                    },
                    end: {
                        line: this.lastMarker.line,
                        column: this.lastMarker.column,
                        offset: this.lastMarker.index
                    }
                };
                this.delegate(t, s);
            }
            return t;
        }

        expect(e) {
            const t = this.nextToken();
            t.type === 7 && t.value === e || this.throwUnexpectedToken(t);
        }

        expectCommaSeparator() {
            if (this.config.tolerant) {
                const e = this.lookahead;
                e.type === 7 && e.value === ',' ? this.nextToken() : e.type === 7 && e.value === ';' ? (this.nextToken(), this.tolerateUnexpectedToken(e)) : this.tolerateUnexpectedToken(e, Messages.UnexpectedToken);
            } else this.expect(',');
        }

        expectKeyword(e) {
            const t = this.nextToken();
            t.type === 4 && t.value === e || this.throwUnexpectedToken(t);
        }

        match(e) {
            return this.lookahead.type === 7 && this.lookahead.value === e;
        }

        matchKeyword(e) {
            return this.lookahead.type === 4 && this.lookahead.value === e;
        }

        matchContextualKeyword(e) {
            return this.lookahead.type === 3 && this.lookahead.value === e;
        }

        matchAssign() {
            if (this.lookahead.type !== 7) return !1;
            const e = this.lookahead.value;
            return e === '=' || e === '*=' || e === '**=' || e === '/=' || e === '%=' || e === '+=' || e === '-=' || e === '<<=' || e === '>>=' || e === '>>>=' || e === '&=' || e === '^=' || e === '|=' || e === '&&=' || e === '||=' || e === '??=';
        }

        isolateCoverGrammar(e) {
            const t = this.context.isBindingElement;
            const s = this.context.isAssignmentTarget;
            const i = this.context.firstCoverInitializedNameError;
            this.context.isBindingElement = !0, this.context.isAssignmentTarget = !0, this.context.firstCoverInitializedNameError = null;
            const r = e.call(this);
            return this.context.firstCoverInitializedNameError !== null && this.throwUnexpectedToken(this.context.firstCoverInitializedNameError), this.context.isBindingElement = t, this.context.isAssignmentTarget = s, this.context.firstCoverInitializedNameError = i, r;
        }

        inheritCoverGrammar(e) {
            const t = this.context.isBindingElement;
            const s = this.context.isAssignmentTarget;
            const i = this.context.firstCoverInitializedNameError;
            this.context.isBindingElement = !0, this.context.isAssignmentTarget = !0, this.context.firstCoverInitializedNameError = null;
            const r = e.call(this);
            return this.context.isBindingElement = this.context.isBindingElement && t, this.context.isAssignmentTarget = this.context.isAssignmentTarget && s, this.context.firstCoverInitializedNameError = i || this.context.firstCoverInitializedNameError, r;
        }

        consumeSemicolon() {
            this.match(';') ? this.nextToken() : this.hasLineTerminator || (this.lookahead.type === 2 || this.match('}') || this.throwUnexpectedToken(this.lookahead), this.lastMarker.index = this.startMarker.index, this.lastMarker.line = this.startMarker.line, this.lastMarker.column = this.startMarker.column);
        }

        parsePrimaryExpression() {
            const e = this.createNode();
            let t; let s; let
                i;
            switch (this.lookahead.type) {
                case 3:
                    (this.context.isModule || this.context.isAsync) && this.lookahead.value === 'await' && this.tolerateUnexpectedToken(this.lookahead), t = this.matchAsyncFunction() ? this.parseFunctionExpression() : this.finalize(e, new Identifier(this.nextToken().value));
                    break;
                case 6:
                case 8:
                    this.context.strict && this.lookahead.octal && this.tolerateUnexpectedToken(this.lookahead, Messages.StrictOctalLiteral), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1, s = this.nextToken(), i = this.getTokenRaw(s), t = typeof s.value === 'bigint' ? this.finalize(e, new BigIntLiteral(s.value, i, s.value.toString())) : this.finalize(e, new Literal(s.value, i));
                    break;
                case 1:
                    this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1, s = this.nextToken(), i = this.getTokenRaw(s), t = this.finalize(e, new Literal(s.value === 'true', i));
                    break;
                case 5:
                    this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1, s = this.nextToken(), i = this.getTokenRaw(s), t = this.finalize(e, new Literal(null, i));
                    break;
                case 10:
                    t = this.parseTemplateLiteral({
                        isTagged: !1
                    });
                    break;
                case 7:
                    switch (this.lookahead.value) {
                        case '(':
                            this.context.isBindingElement = !1, t = this.inheritCoverGrammar(this.parseGroupExpression);
                            break;
                        case '[':
                            t = this.inheritCoverGrammar(this.parseArrayInitializer);
                            break;
                        case '{':
                            t = this.inheritCoverGrammar(this.parseObjectInitializer);
                            break;
                        case '/':
                        case '/=':
                            this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1, this.scanner.index = this.startMarker.index, s = this.nextRegexToken(), i = this.getTokenRaw(s), t = this.finalize(e, new RegexLiteral(s.regex, i, s.pattern, s.flags));
                            break;
                        case '#':
                            this.nextToken(), t = this.finalize(e, new PrivateIdentifier(this.nextToken().value));
                            break;
                        case '@':
                            const r = this.parseDecorators();
                            this.context.decorators = r;
                            this.parsePrimaryExpression();
                            this.context.decorators = null, t = this.finalize(e, new PrivateIdentifier(this.nextToken().value));
                            break;
                        default:
                            t = this.throwUnexpectedToken(this.nextToken());
                    }
                    break;
                case 4:
                    !this.context.strict && this.context.allowYield && this.matchKeyword('yield') ? t = this.parseIdentifierName() : !this.context.strict && this.matchKeyword('let') ? t = this.finalize(e, new Identifier(this.nextToken().value)) : (this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1, this.matchKeyword('function') ? t = this.parseFunctionExpression() : this.matchKeyword('this') ? (this.nextToken(), t = this.finalize(e, new ThisExpression())) : this.matchKeyword('class') ? t = this.parseClassExpression() : this.matchKeyword('new') ? t = this.parseNewExpression() : this.matchImportCall() ? t = this.parseImportCall() : this.matchImportMeta() ? (this.context.isModule || this.tolerateUnexpectedToken(this.lookahead, Messages.CannotUseImportMetaOutsideAModule), t = this.parseImportMeta()) : t = this.throwUnexpectedToken(this.nextToken()));
                    break;
                default:
                    t = this.throwUnexpectedToken(this.nextToken());
            }
            return t;
        }

        parseSpreadElement() {
            const e = this.createNode();
            this.expect('...');
            const t = this.inheritCoverGrammar(this.parseAssignmentExpression);
            return this.finalize(e, new SpreadElement(t));
        }

        parseArrayInitializer() {
            const e = this.createNode();
            const t = [];
            for (this.expect('['); !this.match(']');) {
                if (this.match(',')) this.nextToken(), t.push(null);
                else if (this.match('...')) {
                    const e = this.parseSpreadElement();
                    this.match(']') || (this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1, this.expect(',')), t.push(e);
                } else t.push(this.inheritCoverGrammar(this.parseAssignmentExpression)), this.match(']') || this.expect(',');
            }
            return this.expect(']'), this.finalize(e, new ArrayExpression(t));
        }

        parsePropertyMethod(e) {
            this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
            const t = this.context.strict;
            const s = this.context.allowStrictDirective;
            this.context.allowStrictDirective = e.simple;
            const i = this.isolateCoverGrammar(this.parseFunctionSourceElements);
            return this.context.strict && e.firstRestricted && this.tolerateUnexpectedToken(e.firstRestricted, e.message), this.context.strict && e.stricted && this.tolerateUnexpectedToken(e.stricted, e.message), this.context.strict = t, this.context.allowStrictDirective = s, i;
        }

        parsePropertyMethodFunction(e) {
            const t = this.createNode();
            const s = this.context.allowYield;
            this.context.allowYield = !0;
            const i = this.parseFormalParameters();
            const r = this.parsePropertyMethod(i);
            return this.context.allowYield = s, this.finalize(t, new FunctionExpression(null, i.params, r, e, !1));
        }

        parsePropertyMethodAsyncFunction(e) {
            const t = this.createNode();
            const s = this.context.allowYield;
            const i = this.context.isAsync;
            this.context.allowYield = !1, this.context.isAsync = !0;
            const r = this.parseFormalParameters();
            const n = this.parsePropertyMethod(r);
            return this.context.allowYield = s, this.context.isAsync = i, this.finalize(t, new FunctionExpression(null, r.params, n, e, !0));
        }

        parseObjectPropertyKey(e = !1) {
            const t = this.createNode();
            const s = this.nextToken();
            let i;
            switch (s.type) {
                case 8:
                case 6:
                    this.context.strict && s.octal && this.tolerateUnexpectedToken(s, Messages.StrictOctalLiteral);
                    const r = this.getTokenRaw(s);
                    i = typeof s.value === 'bigint' ? this.finalize(t, new BigIntLiteral(s.value, r, s.value.toString())) : this.finalize(t, new Literal(s.value, r));
                    break;
                case 3:
                case 1:
                case 5:
                case 4:
                    i = this.finalize(t, e ? new PrivateIdentifier(s.value) : new Identifier(s.value));
                    break;
                case 7:
                    s.value === '[' ? (i = this.isolateCoverGrammar(this.parseAssignmentExpression), this.expect(']')) : i = this.throwUnexpectedToken(s);
                    break;
                default:
                    i = this.throwUnexpectedToken(s);
            }
            return i;
        }

        isPropertyKey(e, t) {
            return e.type === 'Identifier' && e.name === t || e.type === 'Literal' && e.value === t;
        }

        parseObjectProperty(e) {
            const t = this.createNode();
            const s = this.lookahead;
            let i; let r = null;
            let n = null;
            let a = !1;
            let o = !1;
            let u = !1;
            let h = !1;
            let c = !1;
            if (s.type === 3) {
                const e = s.value;
                this.nextToken(), a = this.match('['), h = !(this.hasLineTerminator || e !== 'async' || this.match(':') || this.match('(') || this.match(',')), c = this.match('*'), c && this.nextToken(), r = h ? this.parseObjectPropertyKey() : this.finalize(t, new Identifier(e));
            } else this.match('*') ? this.nextToken() : (a = this.match('['), r = this.parseObjectPropertyKey());
            const l = this.qualifiedPropertyName(this.lookahead);
            if (s.type === 3 && !h && s.value === 'get' && l) i = 'get', a = this.match('['), r = this.parseObjectPropertyKey(), this.context.allowYield = !1, n = this.parseGetterMethod();
            else if (s.type === 3 && !h && s.value === 'set' && l) i = 'set', a = this.match('['), r = this.parseObjectPropertyKey(), n = this.parseSetterMethod();
            else if (s.type === 7 && s.value === '*' && l) i = 'init', a = this.match('['), r = this.parseObjectPropertyKey(), n = this.parseGeneratorMethod(!1), o = !0;
            else if (r || this.throwUnexpectedToken(this.lookahead), i = 'init', this.match(':') && !h) !a && this.isPropertyKey(r, '__proto__') && (e.value && this.tolerateError(Messages.DuplicateProtoProperty), e.value = !0), this.nextToken(), n = this.inheritCoverGrammar(this.parseAssignmentExpression);
            else if (this.match('(')) n = h ? this.parsePropertyMethodAsyncFunction(c) : this.parsePropertyMethodFunction(c), o = !0;
            else if (s.type === 3) {
                const e = this.finalize(t, new Identifier(s.value));
                if (this.match('=')) {
                    this.context.firstCoverInitializedNameError = this.lookahead, this.nextToken(), u = !0;
                    const s = this.isolateCoverGrammar(this.parseAssignmentExpression);
                    n = this.finalize(t, new AssignmentPattern(e, s));
                } else u = !0, n = e;
            } else this.throwUnexpectedToken(this.nextToken());
            return this.finalize(t, new Property(i, r, a, n, o, u));
        }

        parseObjectInitializer() {
            const e = this.createNode();
            this.expect('{');
            const t = [];
            const s = {
                value: !1
            };
            for (; !this.match('}');) {
                const e = this.match('...') ? this.parseSpreadElement() : this.parseObjectProperty(s);
                t.push(e), this.match('}') || e.method && !this.match(',') || this.expectCommaSeparator();
            }
            return this.expect('}'), this.finalize(e, new ObjectExpression(t));
        }

        throwTemplateLiteralEarlyErrors(e) {
            switch (e.notEscapeSequenceHead) {
                case 'u':
                    return this.throwUnexpectedToken(e, Messages.InvalidUnicodeEscapeSequence);
                case 'x':
                    return this.throwUnexpectedToken(e, Messages.InvalidHexEscapeSequence);
                case '8':
                case '9':
                    return this.throwUnexpectedToken(e, Messages.TemplateEscape89);
                default:
                    return this.throwUnexpectedToken(e, Messages.TemplateOctalLiteral);
            }
        }

        parseTemplateHead(e) {
            assert(this.lookahead.head, 'Template literal must start with a template head');
            const t = this.createNode();
            const s = this.nextToken();
            e.isTagged || s.notEscapeSequenceHead === null || this.throwTemplateLiteralEarlyErrors(s);
            const i = s.value;
            const r = s.cooked;
            return this.finalize(t, new TemplateElement({
                raw: i,
                cooked: r
            }, s.tail));
        }

        parseTemplateElement(e) {
            this.lookahead.type !== 10 && this.throwUnexpectedToken();
            const t = this.createNode();
            const s = this.nextToken();
            e.isTagged || s.notEscapeSequenceHead === null || this.throwTemplateLiteralEarlyErrors(s);
            const i = s.value;
            const r = s.cooked;
            return this.finalize(t, new TemplateElement({
                raw: i,
                cooked: r
            }, s.tail));
        }

        parseTemplateLiteral(e) {
            const t = this.createNode();
            const s = [];
            const i = [];
            let r = this.parseTemplateHead(e);
            for (i.push(r); !r.tail;) s.push(this.parseExpression()), r = this.parseTemplateElement(e), i.push(r);
            return this.finalize(t, new TemplateLiteral(i, s));
        }

        reinterpretExpressionAsPattern(e) {
            switch (e.type) {
                case 'Identifier':
                case 'MemberExpression':
                case 'RestElement':
                case 'AssignmentPattern':
                default:
                    break;
                case 'SpreadElement':
                    e.type = 'RestElement', this.reinterpretExpressionAsPattern(e.argument);
                    break;
                case 'ArrayExpression':
                    e.type = 'ArrayPattern';
                    for (let t = 0; t < e.elements.length; t++) e.elements[t] !== null && this.reinterpretExpressionAsPattern(e.elements[t]);
                    break;
                case 'ObjectExpression':
                    e.type = 'ObjectPattern';
                    for (let t = 0; t < e.properties.length; t++) {
                        const s = e.properties[t];
                        this.reinterpretExpressionAsPattern(s.type === 'SpreadElement' ? s : s.value);
                    }
                    break;
                case 'AssignmentExpression':
                    e.type = 'AssignmentPattern', delete e.operator, this.reinterpretExpressionAsPattern(e.left);
            }
        }

        parseGroupExpression() {
            let e;
            if (this.expect('('), this.match(')')) {
                this.nextToken(), this.match('=>') || this.expect('=>'), e = {
                    type: ArrowParameterPlaceHolder,
                    params: [],
                    async: !1
                };
            } else {
                const t = this.lookahead;
                const s = [];
                if (this.match('...')) {
                    e = this.parseRestElement(s), this.expect(')'), this.match('=>') || this.expect('=>'), e = {
                        type: ArrowParameterPlaceHolder,
                        params: [e],
                        async: !1
                    };
                } else {
                    let i = !1;
                    if (this.context.isBindingElement = !0, e = this.inheritCoverGrammar(this.parseAssignmentExpression), this.match(',')) {
                        const r = [];
                        for (this.context.isAssignmentTarget = !1, r.push(e); this.lookahead.type !== 2 && this.match(',');) {
                            if (this.nextToken(), this.match(')')) {
                                this.nextToken();
                                for (let e = 0; e < r.length; e++) this.reinterpretExpressionAsPattern(r[e]);
                                i = !0, e = {
                                    type: ArrowParameterPlaceHolder,
                                    params: r,
                                    async: !1
                                };
                            } else if (this.match('...')) {
                                this.context.isBindingElement || this.throwUnexpectedToken(this.lookahead), r.push(this.parseRestElement(s)), this.expect(')'), this.match('=>') || this.expect('=>'), this.context.isBindingElement = !1;
                                for (let e = 0; e < r.length; e++) this.reinterpretExpressionAsPattern(r[e]);
                                i = !0, e = {
                                    type: ArrowParameterPlaceHolder,
                                    params: r,
                                    async: !1
                                };
                            } else r.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
                            if (i) break;
                        }
                        i || (e = this.finalize(this.startNode(t), new SequenceExpression(r)));
                    }
                    if (!i) {
                        if (this.expect(')'), this.match('=>') && (e.type === 'Identifier' && e.name === 'yield' && (i = !0, e = {
                            type: ArrowParameterPlaceHolder,
                            params: [e],
                            async: !1
                        }), !i)) {
                            if (this.context.isBindingElement || this.throwUnexpectedToken(this.lookahead), e.type === 'SequenceExpression') for (let t = 0; t < e.expressions.length; t++) this.reinterpretExpressionAsPattern(e.expressions[t]);
                            else this.reinterpretExpressionAsPattern(e);
                            const t = e.type === 'SequenceExpression' ? e.expressions : [e];
                            e = {
                                type: ArrowParameterPlaceHolder,
                                params: t,
                                async: !1
                            };
                        }
                        this.context.isBindingElement = !1;
                    }
                }
            }
            return e;
        }

        parseArguments() {
            this.expect('(');
            const e = [];
            if (!this.match(')')) {
                for (;;) {
                    const t = this.match('...') ? this.parseSpreadElement() : this.isolateCoverGrammar(this.parseAssignmentExpression);
                    if (e.push(t), this.match(')')) break;
                    if (this.expectCommaSeparator(), this.match(')')) break;
                }
            }
            return this.expect(')'), e;
        }

        isIdentifierName(e) {
            return e.type === 3 || e.type === 4 || e.type === 1 || e.type === 5;
        }

        parseIdentifierName(e = !1) {
            let t = !1;
            const s = this.createNode();
            let i = this.nextToken();
            return i.value === '#' && e && (i = this.nextToken(), t = !0), this.isIdentifierName(i) || this.throwUnexpectedToken(i), this.finalize(s, t ? new PrivateIdentifier(i.value) : new Identifier(i.value));
        }

        parseNewExpression() {
            const e = this.createNode();
            const t = this.parseIdentifierName();
            let s;
            if (assert(t.name === 'new', 'New expression must start with `new`'), this.match('.')) {
                if (this.nextToken(), this.lookahead.type === 3 && this.context.inFunctionBody && this.lookahead.value === 'target') {
                    const e = this.parseIdentifierName();
                    s = new MetaProperty(t, e);
                } else this.throwUnexpectedToken(this.lookahead);
            } else if (this.matchKeyword('import')) this.throwUnexpectedToken(this.lookahead);
            else {
                const e = this.isolateCoverGrammar(this.parseLeftHandSideExpression);
                const t = this.match('(') ? this.parseArguments() : [];
                s = new NewExpression(e, t), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
            }
            return this.finalize(e, s);
        }

        parseAsyncArgument() {
            const e = this.parseAssignmentExpression();
            return this.context.firstCoverInitializedNameError = null, e;
        }

        parseAsyncArguments() {
            this.expect('(');
            const e = [];
            if (!this.match(')')) {
                for (;;) {
                    const t = this.match('...') ? this.parseSpreadElement() : this.isolateCoverGrammar(this.parseAsyncArgument);
                    if (e.push(t), this.match(')')) break;
                    if (this.expectCommaSeparator(), this.match(')')) break;
                }
            }
            return this.expect(')'), e;
        }

        matchImportCall() {
            let e = this.matchKeyword('import');
            if (e) {
                const t = this.scanner.saveState();
                this.scanner.scanComments();
                const s = this.scanner.lex();
                this.scanner.restoreState(t), e = s.type === 7 && s.value === '(';
            }
            return e;
        }

        parseImportCall() {
            const e = this.createNode();
            this.expectKeyword('import'), this.expect('(');
            const t = this.context.isAssignmentTarget;
            this.context.isAssignmentTarget = !0;
            const s = this.parseAssignmentExpression();
            let i = null;
            return this.match(',') && (this.nextToken(), this.match(')') || (i = this.parseAssignmentExpression())), this.context.isAssignmentTarget = t, this.match(')') ? this.nextToken() : (this.match(',') && this.nextToken(), this.expect(')')), this.finalize(e, new ImportExpression(s, i));
        }

        matchImportMeta() {
            let e = this.matchKeyword('import');
            if (e) {
                const t = this.scanner.saveState();
                this.scanner.scanComments();
                const s = this.scanner.lex();
                if (s.type === 7 && s.value === '.') {
                    this.scanner.scanComments();
                    const t = this.scanner.lex();
                    e = t.type === 3 && t.value === 'meta', e && t.end - t.start != 4 && this.tolerateUnexpectedToken(t, Messages.InvalidEscapedReservedWord);
                } else e = !1;
                this.scanner.restoreState(t);
            }
            return e;
        }

        parseImportMeta() {
            const e = this.createNode();
            const t = this.parseIdentifierName();
            this.expect('.');
            const s = this.parseIdentifierName();
            return this.context.isAssignmentTarget = !1, this.finalize(e, new MetaProperty(t, s));
        }

        parseLeftHandSideExpressionAllowCall() {
            const e = this.lookahead;
            const t = this.matchContextualKeyword('async');
            const s = this.context.allowIn;
            let i;
            this.context.allowIn = !0;
            const r = this.matchKeyword('super');
            r && this.context.inFunctionBody ? (i = this.createNode(), this.nextToken(), i = this.finalize(i, new Super()), this.match('(') || this.match('.') || this.match('[') || this.throwUnexpectedToken(this.lookahead)) : i = this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression), !r || !this.match('(') || this.context.inClassConstructor && this.context.allowSuper || this.tolerateError(Messages.UnexpectedSuper);
            let n = !1;
            for (;;) {
                let s = !1;
                if (this.match('?.') && (s = !0, n = !0, this.expect('?.')), this.match('(')) {
                    const r = t && e.lineNumber === this.lookahead.lineNumber;
                    this.context.isBindingElement = !1, this.context.isAssignmentTarget = !1;
                    const n = r ? this.parseAsyncArguments() : this.parseArguments();
                    if (i.type === 'ImportExpression' && n.length !== 1 && this.tolerateError(Messages.BadImportCallArity), i = this.finalize(this.startNode(e), new CallExpression(i, n, s)), r && this.match('=>')) {
                        for (let e = 0; e < n.length; ++e) this.reinterpretExpressionAsPattern(n[e]);
                        i = {
                            type: ArrowParameterPlaceHolder,
                            params: n,
                            async: !0
                        };
                    }
                } else if (this.match('[')) {
                    this.context.isBindingElement = !1, this.context.isAssignmentTarget = !s, this.expect('[');
                    const t = this.isolateCoverGrammar(this.parseExpression);
                    this.expect(']'), i = this.finalize(this.startNode(e), new MemberExpression(!0, i, t, s));
                } else if (this.lookahead.type === 10 && this.lookahead.head) {
                    s && this.throwUnexpectedToken(this.lookahead), n && this.throwError(Messages.InvalidTaggedTemplateOnOptionalChain);
                    const t = this.parseTemplateLiteral({
                        isTagged: !0
                    });
                    i = this.finalize(this.startNode(e), new TaggedTemplateExpression(i, t));
                } else {
                    if (!this.match('.') && !s) break;
                    {
                        this.context.isBindingElement = !1, this.context.isAssignmentTarget = !s, s || this.expect('.');
                        const t = this.parseIdentifierName(!0);
                        i = this.finalize(this.startNode(e), new MemberExpression(!1, i, t, s));
                    }
                }
            }
            return this.context.allowIn = s, n && (i = this.finalize(this.startNode(e), new ChainExpression(i))), i;
        }

        parseSuper() {
            const e = this.createNode();
            return this.expectKeyword('super'), this.match('[') || this.match('.') || this.throwUnexpectedToken(this.lookahead), this.finalize(e, new Super());
        }

        parseLeftHandSideExpression() {
            assert(this.context.allowIn, 'callee of new expression always allow in keyword.');
            const e = this.startNode(this.lookahead);
            let t = this.matchKeyword('super') && this.context.inFunctionBody ? this.parseSuper() : this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
            let s = !1;
            for (;;) {
                let i = !1;
                if (this.match('?.') && (i = !0, s = !0, this.expect('?.')), this.match('[')) {
                    this.context.isBindingElement = !1, this.context.isAssignmentTarget = !i, this.expect('[');
                    const s = this.isolateCoverGrammar(this.parseExpression);
                    this.expect(']'), t = this.finalize(e, new MemberExpression(!0, t, s, i));
                } else if (this.lookahead.type === 10 && this.lookahead.head) {
                    i && this.throwUnexpectedToken(this.lookahead), s && this.throwError(Messages.InvalidTaggedTemplateOnOptionalChain);
                    const r = this.parseTemplateLiteral({
                        isTagged: !0
                    });
                    t = this.finalize(e, new TaggedTemplateExpression(t, r));
                } else {
                    if (!this.match('.') && !i) break;
                    {
                        this.context.isBindingElement = !1, this.context.isAssignmentTarget = !i, i || this.expect('.');
                        const s = this.parseIdentifierName();
                        t = this.finalize(e, new MemberExpression(!1, t, s, i));
                    }
                }
            }
            return s && (t = this.finalize(e, new ChainExpression(t))), t;
        }

        parseUpdateExpression() {
            let e;
            const t = this.lookahead;
            if (this.match('++') || this.match('--')) {
                const s = this.startNode(t);
                const i = this.nextToken();
                e = this.inheritCoverGrammar(this.parseUnaryExpression), this.context.strict && e.type === 'Identifier' && this.scanner.isRestrictedWord(e.name) && this.tolerateError(Messages.StrictLHSPrefix), this.context.isAssignmentTarget || this.tolerateError(Messages.InvalidLHSInAssignment);
                const r = !0;
                e = this.finalize(s, new UpdateExpression(i.value, e, r)), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
            } else if (e = this.inheritCoverGrammar(this.parseLeftHandSideExpressionAllowCall), !this.hasLineTerminator && this.lookahead.type === 7 && (this.match('++') || this.match('--'))) {
                this.context.strict && e.type === 'Identifier' && this.scanner.isRestrictedWord(e.name) && this.tolerateError(Messages.StrictLHSPostfix), this.context.isAssignmentTarget || this.tolerateError(Messages.InvalidLHSInAssignment), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
                const s = this.nextToken().value;
                const i = !1;
                e = this.finalize(this.startNode(t), new UpdateExpression(s, e, i));
            }
            return e;
        }

        parseAwaitExpression() {
            const e = this.createNode();
            this.nextToken();
            const t = this.parseUnaryExpression();
            return this.finalize(e, new AwaitExpression(t));
        }

        parseUnaryExpression() {
            let e;
            if (this.match('+') || this.match('-') || this.match('~') || this.match('!') || this.matchKeyword('delete') || this.matchKeyword('void') || this.matchKeyword('typeof')) {
                const t = this.startNode(this.lookahead);
                const s = this.nextToken();
                e = this.inheritCoverGrammar(this.parseUnaryExpression), e = this.finalize(t, new UnaryExpression(s.value, e)), this.context.strict && e.operator === 'delete' && e.argument.type === 'Identifier' && this.tolerateError(Messages.StrictDelete), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
            } else e = (this.context.isModule && !this.context.inFunctionBody || this.context.isAsync) && this.matchContextualKeyword('await') ? this.parseAwaitExpression() : this.parseUpdateExpression();
            return e;
        }

        parseExponentiationExpression() {
            const e = this.lookahead;
            const t = this.match('(');
            let s = this.inheritCoverGrammar(this.parseUnaryExpression);
            if ((s.type !== 'UnaryExpression' || t) && this.match('**')) {
                this.nextToken(), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
                const t = s;
                const i = this.isolateCoverGrammar(this.parseExponentiationExpression);
                s = this.finalize(this.startNode(e), new BinaryExpression('**', t, i));
            }
            return s;
        }

        binaryPrecedence(e) {
            const t = e.value;
            let s;
            return s = e.type === 7 ? this.operatorPrecedence[t] || 0 : e.type === 4 && (t === 'instanceof' || this.context.allowIn && t === 'in') ? 12 : 0, s;
        }

        parseBinaryExpression() {
            const e = this.lookahead;
            let t = this.inheritCoverGrammar(this.parseExponentiationExpression);
            let s = !0;
            let i = !0;
            const r = e => {
                e.value !== '&&' && e.value !== '||' || (i = !1), e.value === '??' && (s = !1);
            };
            const n = this.lookahead;
            let a = this.binaryPrecedence(n);
            if (a > 0) {
                r(n), this.nextToken(), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
                const o = [e, this.lookahead];
                let u = t;
                let h = this.isolateCoverGrammar(this.parseExponentiationExpression);
                const c = [u, n.value, h];
                const l = [a];
                for (; a = this.binaryPrecedence(this.lookahead), !(a <= 0);) {
                    for ((s || this.lookahead.value !== '&&' && this.lookahead.value !== '||') && (i || this.lookahead.value !== '??') || this.throwUnexpectedToken(this.lookahead), r(this.lookahead); c.length > 2 && a <= l[l.length - 1];) {
                        h = c.pop();
                        const e = c.pop();
                        l.pop(), u = c.pop(), o.pop();
                        const t = o[o.length - 1];
                        const s = this.startNode(t, t.lineStart);
                        const i = e === '||' || e === '&&' || e === '??';
                        c.push(this.finalize(s, i ? new LogicalExpression(e, u, h) : new BinaryExpression(e, u, h)));
                    }
                    c.push(this.nextToken().value), l.push(a), o.push(this.lookahead), c.push(this.isolateCoverGrammar(this.parseExponentiationExpression));
                }
                let p = c.length - 1;
                t = c[p];
                let m = o.pop();
                for (; p > 1;) {
                    const e = o.pop();
                    const s = m && m.lineStart;
                    const i = this.startNode(e, s);
                    const r = c[p - 1];
                    const n = r === '||' || r === '&&' || r === '??';
                    t = this.finalize(i, n ? new LogicalExpression(r, c[p - 2], t) : new BinaryExpression(r, c[p - 2], t)), p -= 2, m = e;
                }
            }
            return t;
        }

        parseConditionalExpression() {
            const e = this.lookahead;
            let t = this.inheritCoverGrammar(this.parseBinaryExpression);
            if (this.match('?')) {
                this.nextToken();
                const s = this.context.allowIn;
                this.context.allowIn = !0;
                const i = this.isolateCoverGrammar(this.parseAssignmentExpression);
                this.context.allowIn = s, this.expect(':');
                const r = this.isolateCoverGrammar(this.parseAssignmentExpression);
                t = this.finalize(this.startNode(e), new ConditionalExpression(t, i, r)), this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
            }
            return t;
        }

        checkPatternParam(e, t) {
            switch (t.type) {
                case 'Identifier':
                    this.validateParam(e, t, t.name);
                    break;
                case 'RestElement':
                    this.checkPatternParam(e, t.argument);
                    break;
                case 'AssignmentPattern':
                    this.checkPatternParam(e, t.left);
                    break;
                case 'ArrayPattern':
                    for (let s = 0; s < t.elements.length; s++) t.elements[s] !== null && this.checkPatternParam(e, t.elements[s]);
                    break;
                case 'ObjectPattern':
                    for (let s = 0; s < t.properties.length; s++) {
                        const i = t.properties[s];
                        this.checkPatternParam(e, i.type === 'RestElement' ? i : i.value);
                    }
            }
            e.simple = e.simple && t instanceof Identifier;
        }

        reinterpretAsCoverFormalsList(e) {
            let t = [e];
            const s = {
                simple: !0,
                paramSet: {}
            };
            let i = !1;
            switch (e.type) {
                case 'Identifier':
                    break;
                case ArrowParameterPlaceHolder:
                    t = e.params, i = e.async;
                    break;
                default:
                    return null;
            }
            for (let e = 0; e < t.length; ++e) {
                const r = t[e];
                r.type === 'AssignmentPattern' ? r.right.type === 'YieldExpression' && (r.right.argument && this.throwUnexpectedToken(this.lookahead), r.right.type = 'Identifier', r.right.name = 'yield', delete r.right.argument, delete r.right.delegate) : i && r.type === 'Identifier' && r.name === 'await' && this.throwUnexpectedToken(this.lookahead), this.checkPatternParam(s, r), t[e] = r;
            }
            if (this.context.strict || !this.context.allowYield) {
                for (let e = 0; e < t.length; ++e) {
                    t[e].type === 'YieldExpression' && this.throwUnexpectedToken(this.lookahead);
                }
            }
            if (s.hasDuplicateParameterNames) {
                const e = this.context.strict ? s.stricted : s.firstRestricted;
                this.throwUnexpectedToken(e, Messages.DuplicateParameter);
            }
            return {
                simple: s.simple,
                params: t,
                stricted: s.stricted,
                firstRestricted: s.firstRestricted,
                message: s.message
            };
        }

        parseAssignmentExpression() {
            let e;
            if (!this.context.allowYield && this.matchKeyword('yield')) e = this.parseYieldExpression();
            else {
                const t = this.lookahead;
                let s = t;
                if (e = this.parseConditionalExpression(), s.type === 3 && s.lineNumber === this.lookahead.lineNumber && s.value === 'async' && (this.lookahead.type === 3 || this.matchKeyword('yield'))) {
                    const t = this.parsePrimaryExpression();
                    this.reinterpretExpressionAsPattern(t), e = {
                        type: ArrowParameterPlaceHolder,
                        params: [t],
                        async: !0
                    };
                }
                if (e.type === ArrowParameterPlaceHolder || this.match('=>')) {
                    this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1;
                    const s = e.async;
                    const i = this.reinterpretAsCoverFormalsList(e);
                    if (i) {
                        this.hasLineTerminator && this.tolerateUnexpectedToken(this.lookahead), this.context.firstCoverInitializedNameError = null;
                        const r = this.context.strict;
                        const n = this.context.allowStrictDirective;
                        this.context.allowStrictDirective = i.simple;
                        const a = this.context.allowYield;
                        const o = this.context.isAsync;
                        this.context.allowYield = !0, this.context.isAsync = s;
                        const u = this.startNode(t);
                        let h;
                        if (this.expect('=>'), this.match('{')) {
                            const e = this.context.allowIn;
                            this.context.allowIn = !0, h = this.parseFunctionSourceElements(), this.context.allowIn = e;
                        } else h = this.isolateCoverGrammar(this.parseAssignmentExpression);
                        const c = h.type !== 'BlockStatement';
                        this.context.strict && i.firstRestricted && this.throwUnexpectedToken(i.firstRestricted, i.message), this.context.strict && i.stricted && this.tolerateUnexpectedToken(i.stricted, i.message), e = this.finalize(u, new ArrowFunctionExpression(i.params, h, c, s)), this.context.strict = r, this.context.allowStrictDirective = n, this.context.allowYield = a, this.context.isAsync = o;
                    }
                } else if (this.matchAssign()) {
                    if (this.context.isAssignmentTarget || this.tolerateError(Messages.InvalidLHSInAssignment), this.context.strict && e.type === 'Identifier') {
                        const t = e;
                        this.scanner.isRestrictedWord(t.name) && this.tolerateUnexpectedToken(s, Messages.StrictLHSAssignment), this.scanner.isStrictModeReservedWord(t.name) && this.tolerateUnexpectedToken(s, Messages.StrictReservedWord);
                    }
                    this.match('=') ? this.reinterpretExpressionAsPattern(e) : (this.context.isAssignmentTarget = !1, this.context.isBindingElement = !1), s = this.nextToken();
                    const i = s.value;
                    const r = this.isolateCoverGrammar(this.parseAssignmentExpression);
                    e = this.finalize(this.startNode(t), new AssignmentExpression(i, e, r)), this.context.firstCoverInitializedNameError = null;
                }
            }
            return e;
        }

        parseExpression() {
            const e = this.lookahead;
            let t = this.isolateCoverGrammar(this.parseAssignmentExpression);
            if (this.match(',')) {
                const s = [];
                for (s.push(t); this.lookahead.type !== 2 && this.match(',');) this.nextToken(), s.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
                t = this.finalize(this.startNode(e), new SequenceExpression(s));
            }
            return t;
        }

        parseStatementListItem() {
            let e;
            if (this.context.isAssignmentTarget = !0, this.context.isBindingElement = !0, this.lookahead.type === 4) {
                switch (this.lookahead.value) {
                    case 'export':
                        this.context.isModule || this.tolerateUnexpectedToken(this.lookahead, Messages.IllegalExportDeclaration), e = this.parseExportDeclaration();
                        break;
                    case 'import':
                        this.matchImportCall() ? e = this.parseExpressionStatement() : this.matchImportMeta() ? e = this.parseStatement() : (this.context.isModule || this.tolerateUnexpectedToken(this.lookahead, Messages.IllegalImportDeclaration), e = this.parseImportDeclaration());
                        break;
                    case 'const':
                        e = this.parseLexicalDeclaration({
                            inFor: !1
                        });
                        break;
                    case 'function':
                        e = this.parseFunctionDeclaration();
                        break;
                    case 'class':
                        e = this.parseClassDeclaration();
                        break;
                    case 'let':
                        e = this.isLexicalDeclaration() ? this.parseLexicalDeclaration({
                            inFor: !1
                        }) : this.parseStatement();
                        break;
                    default:
                        e = this.parseStatement();
                }
            } else e = this.parseStatement();
            return e;
        }

        parseBlock() {
            const e = this.createNode();
            this.expect('{');
            const t = [];
            for (; !this.match('}');) t.push(this.parseStatementListItem());
            return this.expect('}'), this.finalize(e, new BlockStatement(t));
        }

        parseLexicalBinding(e, t) {
            const s = this.createNode();
            const i = this.parsePattern([], e);
            this.context.strict && i.type === 'Identifier' && this.scanner.isRestrictedWord(i.name) && this.tolerateError(Messages.StrictVarName);
            let r = null;
            return e === 'const' ? this.matchKeyword('in') || this.matchContextualKeyword('of') || (this.match('=') ? (this.nextToken(), r = this.isolateCoverGrammar(this.parseAssignmentExpression)) : this.throwError(Messages.DeclarationMissingInitializer, 'const')) : (!t.inFor && i.type !== 'Identifier' || this.match('=')) && (this.expect('='), r = this.isolateCoverGrammar(this.parseAssignmentExpression)), this.finalize(s, new VariableDeclarator(i, r));
        }

        parseBindingList(e, t) {
            const s = [this.parseLexicalBinding(e, t)];
            for (; this.match(',');) this.nextToken(), s.push(this.parseLexicalBinding(e, t));
            return s;
        }

        isLexicalDeclaration() {
            const e = this.scanner.saveState();
            this.scanner.scanComments();
            const t = this.scanner.lex();
            return this.scanner.restoreState(e), t.type === 3 || t.type === 7 && t.value === '[' || t.type === 7 && t.value === '{' || t.type === 4 && t.value === 'let' || t.type === 4 && t.value === 'yield';
        }

        parseLexicalDeclaration(e) {
            const t = this.createNode();
            const s = this.nextToken().value;
            assert(s === 'let' || s === 'const', 'Lexical declaration must be either let or const');
            const i = this.parseBindingList(s, e);
            return this.consumeSemicolon(), this.finalize(t, new VariableDeclaration(i, s));
        }

        isInitializedProperty() {
            const e = this.scanner.saveState();
            this.scanner.scanComments();
            const t = this.scanner.lex();
            return this.scanner.restoreState(e), this.lookahead.type === 3 && t.value === '=';
        }

        isDeclaredProperty() {
            const e = this.scanner.saveState();
            this.scanner.scanComments();
            const t = this.scanner.lex();
            return this.scanner.restoreState(e), this.lookahead.type === 3 && t.value === ';' || this.lookahead.type === 3 && t.lineNumber !== this.startMarker.line;
        }

        parseBindingRestElement(e, t) {
            const s = this.createNode();
            this.expect('...');
            const i = this.parsePattern(e, t);
            return this.finalize(s, new RestElement(i));
        }

        parseArrayPattern(e, t) {
            const s = this.createNode();
            this.expect('[');
            const i = [];
            for (; !this.match(']');) {
                if (this.match(',')) this.nextToken(), i.push(null);
                else {
                    if (this.match('...')) {
                        i.push(this.parseBindingRestElement(e, t));
                        break;
                    }
                    i.push(this.parsePatternWithDefault(e, t)), this.match(']') || this.expect(',');
                }
            } return this.expect(']'), this.finalize(s, new ArrayPattern(i));
        }

        parsePropertyPattern(e, t) {
            const s = this.createNode();
            let i = !1;
            let r = !1;
            let n; let
                a;
            if (this.lookahead.type === 3) {
                const i = this.lookahead;
                n = this.parseVariableIdentifier();
                const o = this.finalize(s, new Identifier(i.value));
                if (this.match('=')) {
                    e.push(i), r = !0, this.nextToken();
                    const t = this.parseAssignmentExpression();
                    a = this.finalize(this.startNode(i), new AssignmentPattern(o, t));
                } else this.match(':') ? (this.expect(':'), a = this.parsePatternWithDefault(e, t)) : (e.push(i), r = !0, a = o);
            } else i = this.match('['), n = this.parseObjectPropertyKey(), this.expect(':'), a = this.parsePatternWithDefault(e, t);
            return this.finalize(s, new Property('init', n, i, a, !1, r));
        }

        parseRestProperty(e) {
            const t = this.createNode();
            this.expect('...');
            const s = this.parsePattern(e);
            return this.match('=') && this.throwError(Messages.DefaultRestProperty), this.match('}') || this.throwError(Messages.PropertyAfterRestProperty), this.finalize(t, new RestElement(s));
        }

        parseObjectPattern(e, t) {
            const s = this.createNode();
            const i = [];
            for (this.expect('{'); !this.match('}');) i.push(this.match('...') ? this.parseRestProperty(e) : this.parsePropertyPattern(e, t)), this.match('}') || this.expect(',');
            return this.expect('}'), this.finalize(s, new ObjectPattern(i));
        }

        parsePattern(e, t) {
            let s;
            return this.match('[') ? s = this.parseArrayPattern(e, t) : this.match('{') ? s = this.parseObjectPattern(e, t) : (!this.matchKeyword('let') || t !== 'const' && t !== 'let' || this.tolerateUnexpectedToken(this.lookahead, Messages.LetInLexicalBinding), e.push(this.lookahead), s = this.parseVariableIdentifier(t)), s;
        }

        parsePatternWithDefault(e, t) {
            const s = this.lookahead;
            let i = this.parsePattern(e, t);
            if (this.match('=')) {
                this.nextToken();
                const e = this.context.allowYield;
                this.context.allowYield = !0;
                const t = this.isolateCoverGrammar(this.parseAssignmentExpression);
                this.context.allowYield = e, i = this.finalize(this.startNode(s), new AssignmentPattern(i, t));
            }
            return i;
        }

        parseVariableIdentifier(e) {
            const t = this.createNode();
            const s = this.nextToken();
            return s.type === 4 && s.value === 'yield' ? this.context.strict ? this.tolerateUnexpectedToken(s, Messages.StrictReservedWord) : this.context.allowYield || this.throwUnexpectedToken(s) : s.type !== 3 ? this.context.strict && s.type === 4 && this.scanner.isStrictModeReservedWord(s.value) ? this.tolerateUnexpectedToken(s, Messages.StrictReservedWord) : (this.context.strict || s.value !== 'let' || e !== 'var') && this.throwUnexpectedToken(s) : (this.context.isModule || this.context.isAsync) && s.type === 3 && s.value === 'await' && this.tolerateUnexpectedToken(s), this.finalize(t, new Identifier(s.value));
        }

        parseVariableDeclaration(e) {
            const t = this.createNode();
            const s = this.parsePattern([], 'var');
            this.context.strict && s.type === 'Identifier' && this.scanner.isRestrictedWord(s.name) && this.tolerateError(Messages.StrictVarName);
            let i = null;
            return this.match('=') ? (this.nextToken(), i = this.isolateCoverGrammar(this.parseAssignmentExpression)) : s.type === 'Identifier' || e.inFor || this.expect('='), this.finalize(t, new VariableDeclarator(s, i));
        }

        parseVariableDeclarationList(e) {
            const t = {
                inFor: e.inFor
            };
            const s = [];
            for (s.push(this.parseVariableDeclaration(t)); this.match(',');) this.nextToken(), s.push(this.parseVariableDeclaration(t));
            return s;
        }

        parseVariableStatement() {
            const e = this.createNode();
            this.expectKeyword('var');
            const t = this.parseVariableDeclarationList({
                inFor: !1
            });
            return this.consumeSemicolon(), this.finalize(e, new VariableDeclaration(t, 'var'));
        }

        parseEmptyStatement() {
            const e = this.createNode();
            return this.expect(';'), this.finalize(e, new EmptyStatement());
        }

        parseExpressionStatement() {
            const e = this.createNode();
            const t = this.parseExpression();
            return this.consumeSemicolon(), this.finalize(e, new ExpressionStatement(t));
        }

        parseIfClause() {
            return this.context.strict && this.matchKeyword('function') && this.tolerateError(Messages.StrictFunction), this.parseStatement();
        }

        parseIfStatement() {
            const e = this.createNode();
            let t; let
                s = null;
            this.expectKeyword('if'), this.expect('(');
            const i = this.parseExpression();
            return !this.match(')') && this.config.tolerant ? (this.tolerateUnexpectedToken(this.nextToken()), t = this.finalize(this.createNode(), new EmptyStatement())) : (this.expect(')'), t = this.parseIfClause(), this.matchKeyword('else') && (this.nextToken(), s = this.parseIfClause())), this.finalize(e, new IfStatement(i, t, s));
        }

        parseDoWhileStatement() {
            const e = this.createNode();
            this.expectKeyword('do'), this.tolerateInvalidLoopStatement();
            const t = this.context.inIteration;
            this.context.inIteration = !0;
            const s = this.parseStatement();
            this.context.inIteration = t, this.expectKeyword('while'), this.expect('(');
            const i = this.parseExpression();
            return !this.match(')') && this.config.tolerant ? this.tolerateUnexpectedToken(this.nextToken()) : (this.expect(')'), this.match(';') && this.nextToken()), this.finalize(e, new DoWhileStatement(s, i));
        }

        parseWhileStatement() {
            const e = this.createNode();
            let t;
            this.expectKeyword('while'), this.expect('(');
            const s = this.parseExpression();
            if (!this.match(')') && this.config.tolerant) this.tolerateUnexpectedToken(this.nextToken()), t = this.finalize(this.createNode(), new EmptyStatement());
            else {
                this.expect(')');
                const e = this.context.inIteration;
                this.context.inIteration = !0, t = this.parseStatement(), this.context.inIteration = e;
            }
            return this.finalize(e, new WhileStatement(s, t));
        }

        parseForStatement() {
            let e; let t; let s = null;
            let i = null;
            let r = null;
            let n = !0;
            let a = !1;
            const o = this.createNode();
            if (this.expectKeyword('for'), this.matchContextualKeyword('await') && (this.context.isAsync || this.tolerateUnexpectedToken(this.lookahead), a = !0, this.nextToken()), this.expect('('), this.match(';')) this.nextToken();
            else if (this.matchKeyword('var')) {
                s = this.createNode(), this.nextToken();
                const i = this.context.allowIn;
                this.context.allowIn = !1;
                const r = this.parseVariableDeclarationList({
                    inFor: !0
                });
                if (this.context.allowIn = i, !a && r.length === 1 && this.matchKeyword('in')) {
                    const i = r[0];
                    i.init && (i.id.type === 'ArrayPattern' || i.id.type === 'ObjectPattern' || this.context.strict) && this.tolerateError(Messages.ForInOfLoopInitializer, 'for-in'), s = this.finalize(s, new VariableDeclaration(r, 'var')), this.nextToken(), e = s, t = this.parseExpression(), s = null;
                } else r.length === 1 && r[0].init === null && this.matchContextualKeyword('of') ? (s = this.finalize(s, new VariableDeclaration(r, 'var')), this.nextToken(), e = s, t = this.parseAssignmentExpression(), s = null, n = !1) : (s = this.finalize(s, new VariableDeclaration(r, 'var')), this.expect(';'));
            } else if (this.matchKeyword('const') || this.matchKeyword('let')) {
                s = this.createNode();
                const i = this.nextToken().value;
                if (this.context.strict || this.lookahead.value !== 'in') {
                    const r = this.context.allowIn;
                    this.context.allowIn = !1;
                    const a = this.parseBindingList(i, {
                        inFor: !0
                    });
                    this.context.allowIn = r, a.length === 1 && a[0].init === null && this.matchKeyword('in') ? (s = this.finalize(s, new VariableDeclaration(a, i)), this.nextToken(), e = s, t = this.parseExpression(), s = null) : a.length === 1 && a[0].init === null && this.matchContextualKeyword('of') ? (s = this.finalize(s, new VariableDeclaration(a, i)), this.nextToken(), e = s, t = this.parseAssignmentExpression(), s = null, n = !1) : (this.consumeSemicolon(), s = this.finalize(s, new VariableDeclaration(a, i)));
                } else s = this.finalize(s, new Identifier(i)), this.nextToken(), e = s, t = this.parseExpression(), s = null;
            } else {
                const i = this.lookahead;
                const r = this.context.isBindingElement;
                const a = this.context.isAssignmentTarget;
                const o = this.context.firstCoverInitializedNameError;
                const u = this.context.allowIn;
                if (this.context.allowIn = !1, s = this.inheritCoverGrammar(this.parseAssignmentExpression), this.context.allowIn = u, this.matchKeyword('in')) this.context.isAssignmentTarget && s.type !== 'AssignmentExpression' || this.tolerateError(Messages.InvalidLHSInForIn), this.nextToken(), this.reinterpretExpressionAsPattern(s), e = s, t = this.parseExpression(), s = null;
                else if (this.matchContextualKeyword('of')) this.context.isAssignmentTarget && s.type !== 'AssignmentExpression' || this.tolerateError(Messages.InvalidLHSInForLoop), this.nextToken(), this.reinterpretExpressionAsPattern(s), e = s, t = this.parseAssignmentExpression(), s = null, n = !1;
                else {
                    if (this.context.isBindingElement = r, this.context.isAssignmentTarget = a, this.context.firstCoverInitializedNameError = o, this.match(',')) {
                        const e = [s];
                        for (; this.match(',');) this.nextToken(), e.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
                        s = this.finalize(this.startNode(i), new SequenceExpression(e));
                    }
                    this.expect(';');
                }
            }
            let u;
            if (void 0 === e && (this.match(';') || (i = this.isolateCoverGrammar(this.parseExpression)), this.expect(';'), this.match(')') || (r = this.isolateCoverGrammar(this.parseExpression))), !this.match(')') && this.config.tolerant) this.tolerateUnexpectedToken(this.nextToken()), u = this.finalize(this.createNode(), new EmptyStatement());
            else {
                this.expect(')'), this.tolerateInvalidLoopStatement();
                const e = this.context.inIteration;
                this.context.inIteration = !0, u = this.isolateCoverGrammar(this.parseStatement), this.context.inIteration = e;
            }
            return void 0 === e ? this.finalize(o, new ForStatement(s, i, r, u)) : n ? this.finalize(o, new ForInStatement(e, t, u)) : this.finalize(o, new ForOfStatement(e, t, u, a));
        }

        parseContinueStatement() {
            const e = this.createNode();
            this.expectKeyword('continue');
            let t = null;
            if (this.lookahead.type === 3 && !this.hasLineTerminator) {
                const e = this.parseVariableIdentifier();
                t = e;
                const s = `$${e.name}`;
                Object.prototype.hasOwnProperty.call(this.context.labelSet, s) || this.throwError(Messages.UnknownLabel, e.name);
            }
            return this.consumeSemicolon(), t !== null || this.context.inIteration || this.throwError(Messages.IllegalContinue), this.finalize(e, new ContinueStatement(t));
        }

        parseBreakStatement() {
            const e = this.createNode();
            this.expectKeyword('break');
            let t = null;
            if (this.lookahead.type === 3 && !this.hasLineTerminator) {
                const e = this.parseVariableIdentifier();
                const s = `$${e.name}`;
                Object.prototype.hasOwnProperty.call(this.context.labelSet, s) || this.throwError(Messages.UnknownLabel, e.name), t = e;
            }
            return this.consumeSemicolon(), t !== null || this.context.inIteration || this.context.inSwitch || this.throwError(Messages.IllegalBreak), this.finalize(e, new BreakStatement(t));
        }

        parseReturnStatement() {
            this.context.inFunctionBody || this.tolerateError(Messages.IllegalReturn);
            const e = this.createNode();
            this.expectKeyword('return');
            const t = !this.match(';') && !this.match('}') && !this.hasLineTerminator && this.lookahead.type !== 2 || this.lookahead.type === 8 || this.lookahead.type === 10 ? this.parseExpression() : null;
            return this.consumeSemicolon(), this.finalize(e, new ReturnStatement(t));
        }

        parseWithStatement() {
            this.context.strict && this.tolerateError(Messages.StrictModeWith);
            const e = this.createNode();
            let t;
            this.expectKeyword('with'), this.expect('(');
            const s = this.parseExpression();
            return !this.match(')') && this.config.tolerant ? (this.tolerateUnexpectedToken(this.nextToken()), t = this.finalize(this.createNode(), new EmptyStatement())) : (this.expect(')'), t = this.parseStatement()), this.finalize(e, new WithStatement(s, t));
        }

        parseSwitchCase() {
            const e = this.createNode();
            let t;
            this.matchKeyword('default') ? (this.nextToken(), t = null) : (this.expectKeyword('case'), t = this.parseExpression()), this.expect(':');
            const s = [];
            for (; !(this.match('}') || this.matchKeyword('default') || this.matchKeyword('case'));) s.push(this.parseStatementListItem());
            return this.finalize(e, new SwitchCase(t, s));
        }

        parseSwitchStatement() {
            const e = this.createNode();
            this.expectKeyword('switch'), this.expect('(');
            const t = this.parseExpression();
            this.expect(')');
            const s = this.context.inSwitch;
            this.context.inSwitch = !0;
            const i = [];
            let r = !1;
            for (this.expect('{'); !this.match('}');) {
                const e = this.parseSwitchCase();
                e.test === null && (r && this.throwError(Messages.MultipleDefaultsInSwitch), r = !0), i.push(e);
            }
            return this.expect('}'), this.context.inSwitch = s, this.finalize(e, new SwitchStatement(t, i));
        }

        parseLabelledStatement() {
            const e = this.createNode();
            const t = this.parseExpression();
            let s;
            if (t.type === 'Identifier' && this.match(':')) {
                this.nextToken();
                const e = t;
                const i = `$${e.name}`;
                let r;
                if (Object.prototype.hasOwnProperty.call(this.context.labelSet, i) && this.throwError(Messages.Redeclaration, 'Label', e.name), this.context.labelSet[i] = !0, this.matchKeyword('class')) this.tolerateUnexpectedToken(this.lookahead), r = this.parseClassDeclaration();
                else if (this.matchKeyword('function')) {
                    const e = this.lookahead;
                    const t = this.parseFunctionDeclaration();
                    this.context.strict ? this.tolerateUnexpectedToken(e, Messages.StrictFunction) : t.generator && this.tolerateUnexpectedToken(e, Messages.GeneratorInLegacyContext), r = t;
                } else r = this.parseStatement();
                delete this.context.labelSet[i], s = new LabeledStatement(e, r);
            } else this.consumeSemicolon(), s = new ExpressionStatement(t);
            return this.finalize(e, s);
        }

        parseThrowStatement() {
            const e = this.createNode();
            this.expectKeyword('throw'), this.hasLineTerminator && this.throwError(Messages.NewlineAfterThrow);
            const t = this.parseExpression();
            return this.consumeSemicolon(), this.finalize(e, new ThrowStatement(t));
        }

        parseCatchClause() {
            const e = this.createNode();
            this.expectKeyword('catch');
            let t = null;
            if (this.match('(')) {
                this.expect('('), this.match(')') && this.throwUnexpectedToken(this.lookahead);
                const e = [];
                t = this.parsePattern(e);
                const s = {};
                for (let t = 0; t < e.length; t++) {
                    const i = `$${e[t].value}`;
                    Object.prototype.hasOwnProperty.call(s, i) && this.tolerateError(Messages.DuplicateBinding, e[t].value), s[i] = !0;
                }
                this.context.strict && t.type === 'Identifier' && this.scanner.isRestrictedWord(t.name) && this.tolerateError(Messages.StrictCatchVariable), this.expect(')');
            }
            const s = this.parseBlock();
            return this.finalize(e, new CatchClause(t, s));
        }

        parseFinallyClause() {
            return this.expectKeyword('finally'), this.parseBlock();
        }

        parseTryStatement() {
            const e = this.createNode();
            this.expectKeyword('try');
            const t = this.parseBlock();
            const s = this.matchKeyword('catch') ? this.parseCatchClause() : null;
            const i = this.matchKeyword('finally') ? this.parseFinallyClause() : null;
            return s || i || this.throwError(Messages.NoCatchOrFinally), this.finalize(e, new TryStatement(t, s, i));
        }

        parseDebuggerStatement() {
            const e = this.createNode();
            return this.expectKeyword('debugger'), this.consumeSemicolon(), this.finalize(e, new DebuggerStatement());
        }

        parseStatement() {
            let e;
            switch (this.lookahead.type) {
                case 1:
                case 5:
                case 6:
                case 8:
                case 10:
                case 9:
                    e = this.parseExpressionStatement();
                    break;
                case 7:
                    const t = this.lookahead.value;
                    e = t === '{' ? this.parseBlock() : t === '(' ? this.parseExpressionStatement() : t === ';' ? this.parseEmptyStatement() : this.parseExpressionStatement();
                    break;
                case 3:
                    e = this.matchAsyncFunction() ? this.parseFunctionDeclaration() : this.parseLabelledStatement();
                    break;
                case 4:
                    switch (this.lookahead.value) {
                        case 'break':
                            e = this.parseBreakStatement();
                            break;
                        case 'continue':
                            e = this.parseContinueStatement();
                            break;
                        case 'debugger':
                            e = this.parseDebuggerStatement();
                            break;
                        case 'do':
                            e = this.parseDoWhileStatement();
                            break;
                        case 'for':
                            e = this.parseForStatement();
                            break;
                        case 'function':
                            e = this.parseFunctionDeclaration();
                            break;
                        case 'if':
                            e = this.parseIfStatement();
                            break;
                        case 'return':
                            e = this.parseReturnStatement();
                            break;
                        case 'switch':
                            e = this.parseSwitchStatement();
                            break;
                        case 'throw':
                            e = this.parseThrowStatement();
                            break;
                        case 'try':
                            e = this.parseTryStatement();
                            break;
                        case 'var':
                            e = this.parseVariableStatement();
                            break;
                        case 'while':
                            e = this.parseWhileStatement();
                            break;
                        case 'with':
                            e = this.parseWithStatement();
                            break;
                        default:
                            e = this.parseExpressionStatement();
                    }
                    break;
                default:
                    e = this.throwUnexpectedToken(this.lookahead);
            }
            return e;
        }

        parseFunctionSourceElements() {
            const e = this.createNode();
            this.expect('{');
            const t = this.parseDirectivePrologues();
            const s = this.context.labelSet;
            const i = this.context.inIteration;
            const r = this.context.inSwitch;
            const n = this.context.inFunctionBody;
            for (this.context.labelSet = {}, this.context.inIteration = !1, this.context.inSwitch = !1, this.context.inFunctionBody = !0; this.lookahead.type !== 2 && !this.match('}');) t.push(this.parseStatementListItem());
            return this.expect('}'), this.context.labelSet = s, this.context.inIteration = i, this.context.inSwitch = r, this.context.inFunctionBody = n, this.finalize(e, new BlockStatement(t));
        }

        validateParam(e, t, s) {
            const i = `$${s}`;
            this.context.strict ? (this.scanner.isRestrictedWord(s) && (e.stricted = t, e.message = Messages.StrictParamName), Object.prototype.hasOwnProperty.call(e.paramSet, i) && (e.stricted = t, e.hasDuplicateParameterNames = !0)) : e.firstRestricted || (this.scanner.isRestrictedWord(s) ? (e.firstRestricted = t, e.message = Messages.StrictParamName) : this.scanner.isStrictModeReservedWord(s) ? (e.firstRestricted = t, e.message = Messages.StrictReservedWord) : Object.prototype.hasOwnProperty.call(e.paramSet, i) && (e.stricted = t, e.hasDuplicateParameterNames = !0)), typeof Object.defineProperty === 'function' ? Object.defineProperty(e.paramSet, i, {
                value: !0,
                enumerable: !0,
                writable: !0,
                configurable: !0
            }) : e.paramSet[i] = !0;
        }

        parseRestElement(e) {
            const t = this.createNode();
            this.expect('...');
            const s = this.parsePattern(e);
            return this.match('=') && this.throwError(Messages.DefaultRestParameter), this.match(')') || this.throwError(Messages.ParameterAfterRestParameter), this.finalize(t, new RestElement(s));
        }

        parseFormalParameter(e) {
            const t = [];
            const s = this.match('...') ? this.parseRestElement(t) : this.parsePatternWithDefault(t);
            for (let s = 0; s < t.length; s++) this.validateParam(e, t[s], t[s].value);
            e.simple = e.simple && s instanceof Identifier, e.params.push(s);
        }

        parseFormalParameters(e) {
            const t = {
                simple: !0,
                hasDuplicateParameterNames: !1,
                params: [],
                firstRestricted: e
            };
            if (this.expect('('), !this.match(')')) for (t.paramSet = {}; this.lookahead.type !== 2 && (this.parseFormalParameter(t), !this.match(')')) && (this.expect(','), !this.match(')')););
            return this.expect(')'), t.hasDuplicateParameterNames && (this.context.strict || this.context.isAsync || !t.simple) && this.throwError(Messages.DuplicateParameter), {
                simple: t.simple,
                params: t.params,
                stricted: t.stricted,
                firstRestricted: t.firstRestricted,
                message: t.message
            };
        }

        matchAsyncFunction() {
            let e = this.matchContextualKeyword('async');
            if (e) {
                const t = this.scanner.saveState();
                this.scanner.scanComments();
                const s = this.scanner.lex();
                this.scanner.restoreState(t), e = t.lineNumber === s.lineNumber && s.type === 4 && s.value === 'function';
            }
            return e;
        }

        parseFunctionDeclaration(e) {
            const t = this.createNode();
            const s = this.matchContextualKeyword('async');
            s && (this.context.inIteration && this.tolerateError(Messages.AsyncFunctionInSingleStatementContext), this.nextToken()), this.expectKeyword('function');
            const i = this.match('*');
            let r;
            i && this.nextToken();
            let n = null;
            let a = null;
            if (!e || !this.match('(')) {
                const e = this.lookahead;
                n = this.parseVariableIdentifier(), this.context.strict ? this.scanner.isRestrictedWord(e.value) && this.tolerateUnexpectedToken(e, Messages.StrictFunctionName) : this.scanner.isRestrictedWord(e.value) ? (a = e, r = Messages.StrictFunctionName) : this.scanner.isStrictModeReservedWord(e.value) && (a = e, r = Messages.StrictReservedWord);
            }
            const o = this.context.isAsync;
            const u = this.context.allowYield;
            this.context.isAsync = s, this.context.allowYield = !i;
            const h = this.parseFormalParameters(a);
            const c = h.params;
            const l = h.stricted;
            a = h.firstRestricted, h.message && (r = h.message);
            const p = this.context.strict;
            const m = this.context.allowStrictDirective;
            this.context.allowStrictDirective = h.simple;
            const d = this.parseFunctionSourceElements();
            return this.context.strict && a && this.throwUnexpectedToken(a, r), this.context.strict && l && this.tolerateUnexpectedToken(l, r), this.context.strict = p, this.context.allowStrictDirective = m, this.context.isAsync = o, this.context.allowYield = u, s ? this.finalize(t, new AsyncFunctionDeclaration(n, c, d, i)) : this.finalize(t, new FunctionDeclaration(n, c, d, i));
        }

        parseFunctionExpression() {
            const e = this.createNode();
            const t = this.matchContextualKeyword('async');
            t && this.nextToken(), this.expectKeyword('function');
            const s = this.match('*');
            let i;
            s && this.nextToken();
            let r; let
                n = null;
            const a = this.context.isAsync;
            const o = this.context.allowYield;
            if (this.context.isAsync = t, this.context.allowYield = !s, !this.match('(')) {
                const e = this.lookahead;
                n = this.context.strict || s || !this.matchKeyword('yield') ? this.parseVariableIdentifier() : this.parseIdentifierName(), this.context.strict ? this.scanner.isRestrictedWord(e.value) && this.tolerateUnexpectedToken(e, Messages.StrictFunctionName) : this.scanner.isRestrictedWord(e.value) ? (r = e, i = Messages.StrictFunctionName) : this.scanner.isStrictModeReservedWord(e.value) && (r = e, i = Messages.StrictReservedWord);
            }
            const u = this.parseFormalParameters(r);
            const h = u.params;
            const c = u.stricted;
            r = u.firstRestricted, u.message && (i = u.message);
            const l = this.context.strict;
            const p = this.context.allowStrictDirective;
            this.context.allowStrictDirective = u.simple;
            const m = this.parseFunctionSourceElements();
            return this.context.strict && r && this.throwUnexpectedToken(r, i), this.context.strict && c && this.tolerateUnexpectedToken(c, i), this.context.strict = l, this.context.allowStrictDirective = p, this.context.isAsync = a, this.context.allowYield = o, this.finalize(e, new FunctionExpression(n, h, m, s, t));
        }

        parseDirective() {
            const e = this.lookahead;
            const t = this.createNode();
            const s = this.parseExpression();
            const i = s.type === 'Literal' ? this.getTokenRaw(e).slice(1, -1) : null;
            return this.consumeSemicolon(), this.finalize(t, i ? new Directive(s, i) : new ExpressionStatement(s));
        }

        parseDirectivePrologues() {
            let e = null;
            const t = [];
            for (;;) {
                const s = this.lookahead;
                if (s.type !== 8) break;
                const i = this.parseDirective();
                t.push(i);
                const r = i.directive;
                if (typeof r !== 'string') break;
                r === 'use strict' ? (this.context.strict = !0, e && this.tolerateUnexpectedToken(e, Messages.StrictOctalLiteral), this.context.allowStrictDirective || this.tolerateUnexpectedToken(s, Messages.IllegalLanguageModeDirective)) : !e && s.octal && (e = s);
            }
            return t;
        }

        qualifiedPropertyName(e) {
            switch (e.type) {
                case 3:
                case 8:
                case 1:
                case 5:
                case 6:
                case 4:
                    return !0;
                case 7:
                    return e.value === '[' || e.value === '#';
            }
            return !1;
        }

        parseGetterMethod() {
            const e = this.createNode();
            const t = this.context.allowYield;
            this.context.allowYield = !0;
            const s = this.parseFormalParameters();
            s.params.length > 0 && this.tolerateError(Messages.BadGetterArity);
            const i = this.parsePropertyMethod(s);
            return this.context.allowYield = t, this.finalize(e, new FunctionExpression(null, s.params, i, false, !1));
        }

        parseSetterMethod() {
            const e = this.createNode();
            const t = this.context.allowYield;
            this.context.allowYield = !0;
            const s = this.parseFormalParameters();
            s.params.length !== 1 ? this.tolerateError(Messages.BadSetterArity) : s.params[0] instanceof RestElement && this.tolerateError(Messages.BadSetterRestParameter);
            const i = this.parsePropertyMethod(s);
            return this.context.allowYield = t, this.finalize(e, new FunctionExpression(null, s.params, i, false, !1));
        }

        parseGeneratorMethod(e) {
            const t = this.createNode();
            const s = this.context.allowYield;
            this.context.allowYield = !0;
            const i = this.parseFormalParameters();
            this.context.allowYield = !1;
            const r = this.parsePropertyMethod(i);
            return this.context.allowYield = s, this.finalize(t, new FunctionExpression(null, i.params, r, !0, e));
        }

        isStartOfExpression() {
            let e = !0;
            const t = this.lookahead.value;
            switch (this.lookahead.type) {
                case 7:
                    e = t === '[' || t === '(' || t === '{' || t === '+' || t === '-' || t === '!' || t === '~' || t === '++' || t === '--' || t === '/' || t === '/=';
                    break;
                case 4:
                    e = t === 'class' || t === 'delete' || t === 'function' || t === 'let' || t === 'new' || t === 'super' || t === 'this' || t === 'typeof' || t === 'void' || t === 'yield';
            }
            return e;
        }

        parseYieldExpression() {
            const e = this.createNode();
            this.expectKeyword('yield');
            let t = null;
            let s = !1;
            if (!this.hasLineTerminator) {
                const e = this.context.allowYield;
                this.context.allowYield = !1, s = this.match('*'), s ? (this.nextToken(), t = this.parseAssignmentExpression()) : this.isStartOfExpression() && (t = this.parseAssignmentExpression()), this.context.allowYield = e;
            }
            return this.finalize(e, new YieldExpression(t, s));
        }

        parseStaticBlock() {
            const e = this.createNode();
            this.expect('{');
            const t = [];
            for (; !this.match('}');) t.push(this.parseStatementListItem());
            return this.expect('}'), this.finalize(e, new StaticBlock(t));
        }

        parseDecorator() {
            const e = this.createNode();
            this.expect('@');
            const t = this.context.strict;
            const s = this.context.allowYield;
            const i = this.context.isAsync;
            this.context.strict = !1, this.context.allowYield = !0, this.context.isAsync = !1;
            const r = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
            return this.context.strict = t, this.context.allowYield = s, this.context.isAsync = i, this.match(';') && this.throwError(Messages.NoSemicolonAfterDecorator), this.finalize(e, new Decorator(r));
        }

        parseDecorators() {
            let e = null;
            for (; this.match('@');) e == null && (e = []), e.push(this.parseDecorator());
            return e;
        }

        parseClassElement(e) {
            let t = this.lookahead;
            const s = this.createNode();
            const i = this.context.inConstructor;
            let r = '';
            let n = null;
            let a = null;
            let o = !1;
            let u = !1;
            let h = !1;
            let c = !1;
            let l = !1;
            let p = !1;
            const m = this.parseDecorators();
            if (m && (t = this.lookahead), this.match('*')) this.nextToken();
            else {
                o = this.match('['), this.match('#') && (p = !0, this.nextToken(), t = this.lookahead), n = this.parseObjectPropertyKey(p);
                const e = n;
                if (this.context.inConstructor = t.type === 3 && t.value === 'constructor', e.name === 'static' && (this.qualifiedPropertyName(this.lookahead) || this.match('*')) && (t = this.lookahead, h = !0, o = this.match('['), this.match('*') ? (this.nextToken(), this.match('#') && (p = !0, this.nextToken(), t = this.lookahead)) : (this.match('#') && (p = !0, this.nextToken(), t = this.lookahead), n = this.parseObjectPropertyKey(p))), e.name === 'static' && this.match('{')) return this.parseStaticBlock();
                if (t.type === 3 && !this.hasLineTerminator && t.value === 'async') {
                    const e = this.lookahead.value;
                    e !== ':' && e !== '(' && (c = !0, l = this.match('*'), l && this.nextToken(), t = this.lookahead, o = this.match('['), this.match('*') ? (this.nextToken(), this.match('#') && (p = !0, this.nextToken())) : (this.match('#') && (p = !0, this.nextToken(), t = this.lookahead), n = this.parseObjectPropertyKey(p)), t.type !== 3 || t.value !== 'constructor' || h || this.tolerateUnexpectedToken(t, Messages.ConstructorIsAsync));
                }
            }
            t.type === 3 && t.value === 'constructor' && p && this.tolerateUnexpectedToken(t, Messages.ConstructorIsPrivate);
            const d = this.qualifiedPropertyName(this.lookahead);
            if (t.type === 3 || t.type === 8 ? t.value === 'get' && d ? (r = 'get', this.match('#') && (p = !0, this.nextToken(), t = this.lookahead), o = this.match('['), n = this.parseObjectPropertyKey(p), this.context.allowYield = !1, a = this.parseGetterMethod()) : t.value === 'set' && d ? (r = 'set', this.match('#') && (p = !0, this.nextToken(), t = this.lookahead), o = this.match('['), n = this.parseObjectPropertyKey(p), a = this.parseSetterMethod()) : this.match('(') || (r = 'property', o = !1, this.match('=') && (this.nextToken(), a = this.isolateCoverGrammar(this.parseAssignmentExpression))) : t.type === 7 && t.value === '*' && d ? (r = 'init', o = this.match('['), n = this.parseObjectPropertyKey(p), a = this.parseGeneratorMethod(c), u = !0) : t.type !== 7 || t.value !== '[' || this.match('(') || (r = 'property', o = !0, this.match('=') && (this.nextToken(), a = this.isolateCoverGrammar(this.parseAssignmentExpression))), !r && n && this.match('(')) {
                const e = this.context.inClassConstructor;
                this.context.inClassConstructor = t.value === 'constructor', r = 'init', a = c ? this.parsePropertyMethodAsyncFunction(l) : this.parsePropertyMethodFunction(l), this.context.inClassConstructor = e, u = !0;
            }
            return r || this.throwUnexpectedToken(this.lookahead), r === 'init' && (r = 'method'), o || (h && this.isPropertyKey(n, 'prototype') && this.throwUnexpectedToken(t, Messages.StaticPrototype), !h && this.isPropertyKey(n, 'constructor') && ((r !== 'method' || !u || a && a.generator) && this.throwUnexpectedToken(t, Messages.ConstructorSpecialMethod), e.value ? this.throwUnexpectedToken(t, Messages.DuplicateConstructor) : e.value = !0, r = 'constructor')), this.context.inConstructor = i, r === 'property' ? (this.consumeSemicolon(), this.finalize(s, new PropertyDefinition(n, o, a, h, m))) : this.finalize(s, new MethodDefinition(n, o, a, r, h, m));
        }

        parseClassElementList() {
            const e = [];
            const t = {
                value: !1
            };
            for (this.expect('{'); !this.match('}');) this.match(';') ? this.nextToken() : e.push(this.parseClassElement(t));
            return this.expect('}'), e;
        }

        parseClassBody() {
            const e = this.createNode();
            const t = this.parseClassElementList();
            return this.finalize(e, new ClassBody(t));
        }

        parseClassDeclaration(e) {
            const t = this.createNode();
            const s = this.context.strict;
            const i = this.context.allowSuper;
            this.context.strict = !0, this.expectKeyword('class');
            const r = e && this.lookahead.type !== 3 ? null : this.parseVariableIdentifier();
            let n = null;
            this.matchKeyword('extends') && (this.nextToken(), n = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall), this.context.allowSuper = !0);
            const a = this.parseClassBody();
            return this.context.allowSuper = i, this.context.strict = s, this.finalize(t, new ClassDeclaration(r, n, a, this.context.decorators));
        }

        parseClassExpression() {
            const e = this.createNode();
            const t = this.context.strict;
            this.context.strict = !0, this.expectKeyword('class');
            const s = this.lookahead.type === 3 ? this.parseVariableIdentifier() : null;
            let i = null;
            this.matchKeyword('extends') && (this.nextToken(), i = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall), this.context.allowSuper = !0);
            const r = this.parseClassBody();
            return this.context.strict = t, this.finalize(e, new ClassExpression(s, i, r, this.context.decorators));
        }

        parseModule() {
            this.context.strict = !0, this.context.isModule = !0, this.scanner.isModule = !0;
            const e = this.createNode();
            const t = this.parseDirectivePrologues();
            for (; this.lookahead.type !== 2;) t.push(this.parseStatementListItem());
            return this.finalize(e, new Module(t));
        }

        parseScript() {
            const e = this.createNode();
            const t = this.parseDirectivePrologues();
            for (; this.lookahead.type !== 2;) t.push(this.parseStatementListItem());
            return this.finalize(e, new Script(t));
        }

        parseImportAttributes() {
            if (this.lookahead.value === 'assert') {
                this.nextToken(), this.expect('{');
                const e = [];
                for (; !this.match('}');) e.push(this.parseImportAttribute()), this.match('}') || this.expectCommaSeparator();
                return this.expect('}'), e;
            }
            return null;
        }

        parseImportAttribute() {
            const e = this.createNode();
            this.lookahead.type !== 3 && this.throwUnexpectedToken(this.nextToken());
            const t = this.parseIdentifierName();
            this.match(':') || this.throwUnexpectedToken(this.nextToken()), this.nextToken();
            const s = this.nextToken();
            const i = this.getTokenRaw(s);
            const r = this.finalize(e, new Literal(s.value, i));
            return this.finalize(e, new ImportAttribute(t, r));
        }

        parseModuleSpecifier() {
            const e = this.createNode();
            this.lookahead.type !== 8 && this.throwError(Messages.InvalidModuleSpecifier);
            const t = this.nextToken();
            const s = this.getTokenRaw(t);
            return Character.isStringWellFormedUnicode(t.value) || this.throwError(Messages.InvalidModuleSpecifier), this.finalize(e, new Literal(t.value, s));
        }

        parseImportSpecifier() {
            const e = this.createNode();
            let t; let
                s;
            return this.lookahead.type === 3 ? (t = this.parseVariableIdentifier(), s = t, this.matchContextualKeyword('as') && (this.nextToken(), s = this.parseVariableIdentifier())) : (t = this.lookahead.type == 8 ? this.parseModuleSpecifier() : this.parseIdentifierName(), s = t, this.matchContextualKeyword('as') ? (this.nextToken(), s = this.parseVariableIdentifier()) : this.throwUnexpectedToken(this.nextToken())), this.finalize(e, new ImportSpecifier(s, t));
        }

        parseNamedImports() {
            this.expect('{');
            const e = [];
            for (; !this.match('}');) e.push(this.parseImportSpecifier()), this.match('}') || this.expect(',');
            return this.expect('}'), e;
        }

        parseImportDefaultSpecifier() {
            const e = this.createNode();
            const t = this.parseIdentifierName();
            return this.finalize(e, new ImportDefaultSpecifier(t));
        }

        parseImportNamespaceSpecifier() {
            const e = this.createNode();
            this.expect('*'), this.matchContextualKeyword('as') || this.throwError(Messages.NoAsAfterImportNamespace), this.lookahead.escaped && this.throwError(Messages.NoAsAndFromEscapeSequences), this.nextToken();
            const t = this.parseIdentifierName();
            return this.finalize(e, new ImportNamespaceSpecifier(t));
        }

        parseImportDeclaration() {
            this.context.inFunctionBody && this.throwError(Messages.IllegalImportDeclaration);
            const e = this.createNode();
            let t;
            this.expectKeyword('import');
            let s = [];
            if (this.lookahead.type === 8) t = this.parseModuleSpecifier();
            else {
                if (this.match('{') ? s = s.concat(this.parseNamedImports()) : this.match('*') ? s.push(this.parseImportNamespaceSpecifier()) : this.isIdentifierName(this.lookahead) && !this.matchKeyword('default') ? (s.push(this.parseImportDefaultSpecifier()), this.match(',') && (this.nextToken(), this.match('*') ? s.push(this.parseImportNamespaceSpecifier()) : this.match('{') ? s = s.concat(this.parseNamedImports()) : this.throwUnexpectedToken(this.lookahead))) : this.throwUnexpectedToken(this.nextToken()), !this.matchContextualKeyword('from')) {
                    const e = this.lookahead.value ? Messages.UnexpectedToken : Messages.MissingFromClause;
                    this.throwError(e, this.lookahead.value);
                }
                this.nextToken(), t = this.parseModuleSpecifier();
            }
            const i = this.parseImportAttributes();
            return this.consumeSemicolon(), this.finalize(e, new ImportDeclaration(s, t, i));
        }

        parseExportSpecifier() {
            const e = this.createNode();
            const t = this.lookahead.type == 8 ? this.parseModuleSpecifier() : this.parseIdentifierName();
            let s = t;
            return this.matchContextualKeyword('as') && (this.lookahead.escaped && this.throwError(Messages.NoAsAndFromEscapeSequences), this.nextToken(), s = this.lookahead.type == 8 ? this.parseModuleSpecifier() : this.parseIdentifierName()), this.finalize(e, new ExportSpecifier(t, s));
        }

        parseExportDeclaration() {
            this.context.inFunctionBody && this.throwError(Messages.IllegalExportDeclaration);
            const e = this.createNode();
            let t;
            if (this.expectKeyword('export'), this.matchKeyword('default')) {
                if (this.nextToken(), this.matchKeyword('function')) {
                    const s = this.parseFunctionDeclaration(!0);
                    t = this.finalize(e, new ExportDefaultDeclaration(s));
                } else if (this.matchKeyword('class')) {
                    const s = this.parseClassDeclaration(!0);
                    t = this.finalize(e, new ExportDefaultDeclaration(s));
                } else if (this.matchContextualKeyword('async')) {
                    const s = this.matchAsyncFunction() ? this.parseFunctionDeclaration(!0) : this.parseAssignmentExpression();
                    t = this.finalize(e, new ExportDefaultDeclaration(s));
                } else {
                    this.matchContextualKeyword('from') && this.throwError(Messages.UnexpectedToken, this.lookahead.value);
                    const s = this.match('{') ? this.parseObjectInitializer() : this.match('[') ? this.parseArrayInitializer() : this.parseAssignmentExpression();
                    this.consumeSemicolon(), t = this.finalize(e, new ExportDefaultDeclaration(s));
                }
            } else if (this.match('*')) {
                this.nextToken();
                let s = null;
                if (this.matchContextualKeyword('as') && (this.lookahead.escaped && this.throwError(Messages.NoAsAndFromEscapeSequences), this.nextToken(), s = this.lookahead.type == 8 ? this.parseModuleSpecifier() : this.parseIdentifierName()), !this.matchContextualKeyword('from')) {
                    const e = this.lookahead.value ? Messages.UnexpectedToken : Messages.MissingFromClause;
                    this.throwError(e, this.lookahead.value);
                }
                this.lookahead.escaped && this.throwError(Messages.NoAsAndFromEscapeSequences), this.nextToken();
                const i = this.parseModuleSpecifier();
                const r = this.parseImportAttributes();
                this.consumeSemicolon(), t = this.finalize(e, new ExportAllDeclaration(i, s, r));
            } else if (this.lookahead.type === 4) {
                let s;
                switch (this.lookahead.value) {
                    case 'let':
                    case 'const':
                        s = this.parseLexicalDeclaration({
                            inFor: !1
                        });
                        break;
                    case 'var':
                    case 'class':
                    case 'function':
                        s = this.parseStatementListItem();
                        break;
                    default:
                        this.throwUnexpectedToken(this.lookahead);
                }
                t = this.finalize(e, new ExportNamedDeclaration(s, [], null, null));
            } else if (this.matchAsyncFunction()) {
                const s = this.parseFunctionDeclaration();
                t = this.finalize(e, new ExportNamedDeclaration(s, [], null, null));
            } else {
                const s = [];
                let i = null;
                let r = !1;
                let n = null;
                for (this.expect('{'); !this.match('}');) r = r || this.matchKeyword('default'), s.push(this.parseExportSpecifier()), this.match('}') || this.expect(',');
                if (this.expect('}'), this.matchContextualKeyword('from')) this.lookahead.escaped && this.throwError(Messages.NoAsAndFromEscapeSequences), this.nextToken(), i = this.parseModuleSpecifier(), n = this.parseImportAttributes(), this.consumeSemicolon();
                else if (r) {
                    const e = this.lookahead.value ? Messages.UnexpectedToken : Messages.MissingFromClause;
                    this.throwError(e, this.lookahead.value);
                } else n = this.parseImportAttributes(), this.consumeSemicolon();
                t = this.finalize(e, new ExportNamedDeclaration(null, s, i, n));
            }
            return t;
        }
    };
    const XHTMLEntities = {
        quot: '"',
        amp: '&',
        apos: "'",
        gt: '>',
        nbsp: ' ',
        iexcl: '¡',
        cent: '¢',
        pound: '£',
        curren: '¤',
        yen: '¥',
        brvbar: '¦',
        sect: '§',
        uml: '¨',
        copy: '©',
        ordf: 'ª',
        laquo: '«',
        not: '¬',
        shy: '­',
        reg: '®',
        macr: '¯',
        deg: '°',
        plusmn: '±',
        sup2: '²',
        sup3: '³',
        acute: '´',
        micro: 'µ',
        para: '¶',
        middot: '·',
        cedil: '¸',
        sup1: '¹',
        ordm: 'º',
        raquo: '»',
        frac14: '¼',
        frac12: '½',
        frac34: '¾',
        iquest: '¿',
        Agrave: 'À',
        Aacute: 'Á',
        Acirc: 'Â',
        Atilde: 'Ã',
        Auml: 'Ä',
        Aring: 'Å',
        AElig: 'Æ',
        Ccedil: 'Ç',
        Egrave: 'È',
        Eacute: 'É',
        Ecirc: 'Ê',
        Euml: 'Ë',
        Igrave: 'Ì',
        Iacute: 'Í',
        Icirc: 'Î',
        Iuml: 'Ï',
        ETH: 'Ð',
        Ntilde: 'Ñ',
        Ograve: 'Ò',
        Oacute: 'Ó',
        Ocirc: 'Ô',
        Otilde: 'Õ',
        Ouml: 'Ö',
        times: '×',
        Oslash: 'Ø',
        Ugrave: 'Ù',
        Uacute: 'Ú',
        Ucirc: 'Û',
        Uuml: 'Ü',
        Yacute: 'Ý',
        THORN: 'Þ',
        szlig: 'ß',
        agrave: 'à',
        aacute: 'á',
        acirc: 'â',
        atilde: 'ã',
        auml: 'ä',
        aring: 'å',
        aelig: 'æ',
        ccedil: 'ç',
        egrave: 'è',
        eacute: 'é',
        ecirc: 'ê',
        euml: 'ë',
        igrave: 'ì',
        iacute: 'í',
        icirc: 'î',
        iuml: 'ï',
        eth: 'ð',
        ntilde: 'ñ',
        ograve: 'ò',
        oacute: 'ó',
        ocirc: 'ô',
        otilde: 'õ',
        ouml: 'ö',
        divide: '÷',
        oslash: 'ø',
        ugrave: 'ù',
        uacute: 'ú',
        ucirc: 'û',
        uuml: 'ü',
        yacute: 'ý',
        thorn: 'þ',
        yuml: 'ÿ',
        OElig: 'Œ',
        oelig: 'œ',
        Scaron: 'Š',
        scaron: 'š',
        Yuml: 'Ÿ',
        fnof: 'ƒ',
        circ: 'ˆ',
        tilde: '˜',
        Alpha: 'Α',
        Beta: 'Β',
        Gamma: 'Γ',
        Delta: 'Δ',
        Epsilon: 'Ε',
        Zeta: 'Ζ',
        Eta: 'Η',
        Theta: 'Θ',
        Iota: 'Ι',
        Kappa: 'Κ',
        Lambda: 'Λ',
        Mu: 'Μ',
        Nu: 'Ν',
        Xi: 'Ξ',
        Omicron: 'Ο',
        Pi: 'Π',
        Rho: 'Ρ',
        Sigma: 'Σ',
        Tau: 'Τ',
        Upsilon: 'Υ',
        Phi: 'Φ',
        Chi: 'Χ',
        Psi: 'Ψ',
        Omega: 'Ω',
        alpha: 'α',
        beta: 'β',
        gamma: 'γ',
        delta: 'δ',
        epsilon: 'ε',
        zeta: 'ζ',
        eta: 'η',
        theta: 'θ',
        iota: 'ι',
        kappa: 'κ',
        lambda: 'λ',
        mu: 'μ',
        nu: 'ν',
        xi: 'ξ',
        omicron: 'ο',
        pi: 'π',
        rho: 'ρ',
        sigmaf: 'ς',
        sigma: 'σ',
        tau: 'τ',
        upsilon: 'υ',
        phi: 'φ',
        chi: 'χ',
        psi: 'ψ',
        omega: 'ω',
        thetasym: 'ϑ',
        upsih: 'ϒ',
        piv: 'ϖ',
        ensp: ' ',
        emsp: ' ',
        thinsp: ' ',
        zwnj: '‌',
        zwj: '‍',
        lrm: '‎',
        rlm: '‏',
        ndash: '–',
        mdash: '—',
        lsquo: '‘',
        rsquo: '’',
        sbquo: '‚',
        ldquo: '“',
        rdquo: '”',
        bdquo: '„',
        dagger: '†',
        Dagger: '‡',
        bull: '•',
        hellip: '…',
        permil: '‰',
        prime: '′',
        Prime: '″',
        lsaquo: '‹',
        rsaquo: '›',
        oline: '‾',
        frasl: '⁄',
        euro: '€',
        image: 'ℑ',
        weierp: '℘',
        real: 'ℜ',
        trade: '™',
        alefsym: 'ℵ',
        larr: '←',
        uarr: '↑',
        rarr: '→',
        darr: '↓',
        harr: '↔',
        crarr: '↵',
        lArr: '⇐',
        uArr: '⇑',
        rArr: '⇒',
        dArr: '⇓',
        hArr: '⇔',
        forall: '∀',
        part: '∂',
        exist: '∃',
        empty: '∅',
        nabla: '∇',
        isin: '∈',
        notin: '∉',
        ni: '∋',
        prod: '∏',
        sum: '∑',
        minus: '−',
        lowast: '∗',
        radic: '√',
        prop: '∝',
        infin: '∞',
        ang: '∠',
        and: '∧',
        or: '∨',
        cap: '∩',
        cup: '∪',
        int: '∫',
        there4: '∴',
        sim: '∼',
        cong: '≅',
        asymp: '≈',
        ne: '≠',
        equiv: '≡',
        le: '≤',
        ge: '≥',
        sub: '⊂',
        sup: '⊃',
        nsub: '⊄',
        sube: '⊆',
        supe: '⊇',
        oplus: '⊕',
        otimes: '⊗',
        perp: '⊥',
        sdot: '⋅',
        lceil: '⌈',
        rceil: '⌉',
        lfloor: '⌊',
        rfloor: '⌋',
        loz: '◊',
        spades: '♠',
        clubs: '♣',
        hearts: '♥',
        diams: '♦',
        lang: '⟨',
        rang: '⟩'
    };

    function getQualifiedElementName(e) {
        let t;
        switch (e.type) {
            case 'JSXIdentifier':
                t = e.name;
                break;
            case 'JSXNamespacedName':
                const s = e;
                t = `${getQualifiedElementName(s.namespace)}:${getQualifiedElementName(s.name)}`;
                break;
            case 'JSXMemberExpression':
                const i = e;
                t = `${getQualifiedElementName(i.object)}.${getQualifiedElementName(i.property)}`;
        }
        return t;
    }
    TokenName[100] = 'JSXIdentifier', TokenName[101] = 'JSXText';
    const JSXParser = class extends Parser {
        constructor(e, t, s) {
            super(e, t, s);
        }

        parsePrimaryExpression() {
            return this.match('<') ? this.parseJSXRoot() : super.parsePrimaryExpression();
        }

        startJSX() {
            this.scanner.index = this.startMarker.index, this.scanner.lineNumber = this.startMarker.line, this.scanner.lineStart = this.startMarker.index - this.startMarker.column;
        }

        finishJSX() {
            this.nextToken();
        }

        reenterJSX() {
            this.startJSX(), this.expectJSX('}'), this.config.tokens && this.tokens.pop();
        }

        createJSXNode() {
            return this.collectComments(), {
                index: this.scanner.index,
                line: this.scanner.lineNumber,
                column: this.scanner.index - this.scanner.lineStart
            };
        }

        createJSXChildNode() {
            return {
                index: this.scanner.index,
                line: this.scanner.lineNumber,
                column: this.scanner.index - this.scanner.lineStart
            };
        }

        scanXHTMLEntity(e) {
            let t = '&';
            let s = !0;
            let i = !1;
            let r = !1;
            let n = !1;
            for (; !this.scanner.eof() && s && !i;) {
                const a = this.scanner.source[this.scanner.index];
                if (a === e) break;
                if (i = a === ';', t += a, ++this.scanner.index, !i) {
                    switch (t.length) {
                        case 2:
                            r = a === '#';
                            break;
                        case 3:
                            r && (n = a === 'x', s = n || Character.isDecimalDigit(a.charCodeAt(0)), r = r && !n);
                            break;
                        default:
                            s = s && !(r && !Character.isDecimalDigit(a.charCodeAt(0))), s = s && !(n && !Character.isHexDigit(a.charCodeAt(0)));
                    }
                }
            }
            if (s && i && t.length > 2) {
                const e = t.substr(1, t.length - 2);
                r && e.length > 1 ? t = String.fromCharCode(parseInt(e.substr(1), 10)) : n && e.length > 2 ? t = String.fromCharCode(parseInt(`0${e.substr(1)}`, 16)) : r || n || !XHTMLEntities[e] || (t = XHTMLEntities[e]);
            }
            return t;
        }

        lexJSX() {
            const e = this.scanner.source.charCodeAt(this.scanner.index);
            if (e === 60 || e === 62 || e === 47 || e === 58 || e === 61 || e === 123 || e === 125) {
                return {
                    type: 7,
                    value: this.scanner.source[this.scanner.index++],
                    lineNumber: this.scanner.lineNumber,
                    lineStart: this.scanner.lineStart,
                    start: this.scanner.index - 1,
                    end: this.scanner.index
                };
            }
            if (e === 34 || e === 39) {
                const e = this.scanner.index;
                const t = this.scanner.source[this.scanner.index++];
                let s = '';
                for (; !this.scanner.eof();) {
                    const e = this.scanner.source[this.scanner.index++];
                    if (e === t) break;
                    s += e === '&' ? this.scanXHTMLEntity(t) : e;
                }
                return {
                    type: 8,
                    value: s,
                    lineNumber: this.scanner.lineNumber,
                    lineStart: this.scanner.lineStart,
                    start: e,
                    end: this.scanner.index
                };
            }
            if (e === 46) {
                const e = this.scanner.source.charCodeAt(this.scanner.index + 1);
                const t = this.scanner.source.charCodeAt(this.scanner.index + 2);
                const s = e === 46 && t === 46 ? '...' : '.';
                const i = this.scanner.index;
                return this.scanner.index += s.length, {
                    type: 7,
                    value: s,
                    lineNumber: this.scanner.lineNumber,
                    lineStart: this.scanner.lineStart,
                    start: i,
                    end: this.scanner.index
                };
            }
            if (e === 96) {
                return {
                    type: 10,
                    value: '',
                    lineNumber: this.scanner.lineNumber,
                    lineStart: this.scanner.lineStart,
                    start: this.scanner.index,
                    end: this.scanner.index
                };
            }
            if (Character.isIdentifierStart(e) && e !== 92) {
                const e = this.scanner.index;
                for (++this.scanner.index; !this.scanner.eof();) {
                    const e = this.scanner.source.charCodeAt(this.scanner.index);
                    if (Character.isIdentifierPart(e) && e !== 92) ++this.scanner.index;
                    else {
                        if (e !== 45) break;
                        ++this.scanner.index;
                    }
                }
                return {
                    type: 100,
                    value: this.scanner.source.slice(e, this.scanner.index),
                    lineNumber: this.scanner.lineNumber,
                    lineStart: this.scanner.lineStart,
                    start: e,
                    end: this.scanner.index
                };
            }
            return this.scanner.lex();
        }

        nextJSXToken() {
            this.collectComments(), this.startMarker.index = this.scanner.index, this.startMarker.line = this.scanner.lineNumber, this.startMarker.column = this.scanner.index - this.scanner.lineStart;
            const e = this.lexJSX();
            return this.lastMarker.index = this.scanner.index, this.lastMarker.line = this.scanner.lineNumber, this.lastMarker.column = this.scanner.index - this.scanner.lineStart, this.config.tokens && this.tokens.push(this.convertToken(e)), e;
        }

        nextJSXText() {
            this.startMarker.index = this.scanner.index, this.startMarker.line = this.scanner.lineNumber, this.startMarker.column = this.scanner.index - this.scanner.lineStart;
            const e = this.scanner.index;
            let t = '';
            for (; !this.scanner.eof();) {
                const e = this.scanner.source[this.scanner.index];
                if (e === '{' || e === '<') break;
                ++this.scanner.index, t += e, Character.isLineTerminator(e.charCodeAt(0)) && (++this.scanner.lineNumber, e === '\r' && this.scanner.source[this.scanner.index] === '\n' && ++this.scanner.index, this.scanner.lineStart = this.scanner.index);
            }
            this.lastMarker.index = this.scanner.index, this.lastMarker.line = this.scanner.lineNumber, this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
            const s = {
                type: 101,
                value: t,
                lineNumber: this.scanner.lineNumber,
                lineStart: this.scanner.lineStart,
                start: e,
                end: this.scanner.index
            };
            return t.length > 0 && this.config.tokens && this.tokens.push(this.convertToken(s)), s;
        }

        peekJSXToken() {
            const e = this.scanner.saveState();
            this.scanner.scanComments();
            const t = this.lexJSX();
            return this.scanner.restoreState(e), t;
        }

        expectJSX(e) {
            const t = this.nextJSXToken();
            t.type === 7 && t.value === e || this.throwUnexpectedToken(t);
        }

        matchJSX(e) {
            const t = this.peekJSXToken();
            return t.type === 7 && t.value === e;
        }

        parseJSXIdentifier() {
            const e = this.createJSXNode();
            const t = this.nextJSXToken();
            return t.type !== 100 && this.throwUnexpectedToken(t), this.finalize(e, new JSXIdentifier(t.value));
        }

        parseJSXElementName() {
            const e = this.createJSXNode();
            let t = this.parseJSXIdentifier();
            if (this.matchJSX(':')) {
                const s = t;
                this.expectJSX(':');
                const i = this.parseJSXIdentifier();
                t = this.finalize(e, new JSXNamespacedName(s, i));
            } else if (this.matchJSX('.')) {
                for (; this.matchJSX('.');) {
                    const s = t;
                    this.expectJSX('.');
                    const i = this.parseJSXIdentifier();
                    t = this.finalize(e, new JSXMemberExpression(s, i));
                }
            }
            return t;
        }

        parseJSXAttributeName() {
            const e = this.createJSXNode();
            let t;
            const s = this.parseJSXIdentifier();
            if (this.matchJSX(':')) {
                const i = s;
                this.expectJSX(':');
                const r = this.parseJSXIdentifier();
                t = this.finalize(e, new JSXNamespacedName(i, r));
            } else t = s;
            return t;
        }

        parseJSXStringLiteralAttribute() {
            const e = this.createJSXNode();
            const t = this.nextJSXToken();
            t.type !== 8 && this.throwUnexpectedToken(t);
            const s = this.getTokenRaw(t);
            return this.finalize(e, new Literal(t.value, s));
        }

        parseJSXExpressionAttribute() {
            const e = this.createJSXNode();
            this.expectJSX('{'), this.finishJSX(), this.match('}') && this.tolerateError('JSX attributes must only be assigned a non-empty expression');
            const t = this.parseAssignmentExpression();
            return this.reenterJSX(), this.finalize(e, new JSXExpressionContainer(t));
        }

        parseJSXAttributeValue() {
            return this.matchJSX('{') ? this.parseJSXExpressionAttribute() : this.matchJSX('<') ? this.parseJSXElement() : this.parseJSXStringLiteralAttribute();
        }

        parseJSXNameValueAttribute() {
            const e = this.createJSXNode();
            const t = this.parseJSXAttributeName();
            let s = null;
            return this.matchJSX('=') && (this.expectJSX('='), s = this.parseJSXAttributeValue()), this.finalize(e, new JSXAttribute(t, s));
        }

        parseJSXSpreadAttribute() {
            const e = this.createJSXNode();
            this.expectJSX('{'), this.expectJSX('...'), this.finishJSX();
            const t = this.parseAssignmentExpression();
            return this.reenterJSX(), this.finalize(e, new JSXSpreadAttribute(t));
        }

        parseJSXAttributes() {
            const e = [];
            for (; !this.matchJSX('/') && !this.matchJSX('>');) {
                const t = this.matchJSX('{') ? this.parseJSXSpreadAttribute() : this.parseJSXNameValueAttribute();
                e.push(t);
            }
            return e;
        }

        parseJSXOpeningElement() {
            const e = this.createJSXNode();
            if (this.expectJSX('<'), this.matchJSX('>')) return this.expectJSX('>'), this.finalize(e, new JSXOpeningFragment(!1));
            const t = this.parseJSXElementName();
            const s = this.parseJSXAttributes();
            const i = this.matchJSX('/');
            return i && this.expectJSX('/'), this.expectJSX('>'), this.finalize(e, new JSXOpeningElement(t, i, s));
        }

        parseJSXBoundaryElement() {
            const e = this.createJSXNode();
            if (this.expectJSX('<'), this.matchJSX('/')) {
                if (this.expectJSX('/'), this.matchJSX('>')) return this.expectJSX('>'), this.finalize(e, new JSXClosingFragment());
                const t = this.parseJSXElementName();
                return this.expectJSX('>'), this.finalize(e, new JSXClosingElement(t));
            }
            const t = this.parseJSXElementName();
            const s = this.parseJSXAttributes();
            const i = this.matchJSX('/');
            return i && this.expectJSX('/'), this.expectJSX('>'), this.finalize(e, new JSXOpeningElement(t, i, s));
        }

        parseJSXEmptyExpression() {
            const e = this.createJSXChildNode();
            return this.collectComments(), this.lastMarker.index = this.scanner.index, this.lastMarker.line = this.scanner.lineNumber, this.lastMarker.column = this.scanner.index - this.scanner.lineStart, this.finalize(e, new JSXEmptyExpression());
        }

        parseJSXExpressionContainer() {
            const e = this.createJSXNode();
            let t;
            return this.expectJSX('{'), this.matchJSX('}') ? (t = this.parseJSXEmptyExpression(), this.expectJSX('}')) : (this.finishJSX(), t = this.parseAssignmentExpression(), this.reenterJSX()), this.finalize(e, new JSXExpressionContainer(t));
        }

        parseJSXChildren() {
            const e = [];
            for (; !this.scanner.eof();) {
                const t = this.createJSXChildNode();
                const s = this.nextJSXText();
                if (s.start < s.end) {
                    const i = this.getTokenRaw(s);
                    const r = this.finalize(t, new JSXText(s.value, i));
                    e.push(r);
                }
                if (this.scanner.source[this.scanner.index] !== '{') break;
                {
                    const t = this.parseJSXExpressionContainer();
                    e.push(t);
                }
            }
            return e;
        }

        parseComplexJSXElement(e) {
            const t = [];
            for (; !this.scanner.eof();) {
                e.children = e.children.concat(this.parseJSXChildren());
                const s = this.createJSXChildNode();
                const i = this.parseJSXBoundaryElement();
                if (i.type === 'JSXOpeningElement') {
                    const r = i;
                    if (r.selfClosing) {
                        const t = this.finalize(s, new JSXElement(r, [], null));
                        e.children.push(t);
                    } else {
                        t.push(e), e = {
                            node: s,
                            opening: r,
                            closing: null,
                            children: []
                        };
                    }
                }
                if (i.type === 'JSXClosingElement') {
                    e.closing = i;
                    const s = getQualifiedElementName(e.opening.name);
                    if (s !== getQualifiedElementName(e.closing.name) && this.tolerateError('Expected corresponding JSX closing tag for %0', s), !(t.length > 0)) break;
                    {
                        const s = this.finalize(e.node, new JSXElement(e.opening, e.children, e.closing));
                        (e = t[t.length - 1]).children.push(s), t.pop();
                    }
                }
                if (i.type === 'JSXClosingFragment') {
                    if (e.closing = i, e.opening.type === 'JSXOpeningFragment') break;
                    this.tolerateError('Expected corresponding JSX closing tag for jsx fragment');
                }
            }
            return e;
        }

        parseJSXElement() {
            const e = this.createJSXNode();
            const t = this.parseJSXOpeningElement();
            let s = [];
            let i = null;
            if (!t.selfClosing) {
                const r = this.parseComplexJSXElement({
                    node: e,
                    opening: t,
                    closing: i,
                    children: s
                });
                s = r.children, i = r.closing;
            }
            return this.finalize(e, new JSXElement(t, s, i));
        }

        parseJSXRoot() {
            this.config.tokens && this.tokens.pop(), this.startJSX();
            const e = this.parseJSXElement();
            return this.finishJSX(), e;
        }

        isStartOfExpression() {
            return super.isStartOfExpression() || this.match('<');
        }
    };
    const beforeFunctionExpressionTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new', 'return', 'case', 'delete', 'throw', 'void', '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', ',', '+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&', '|', '^', '!', '~', '&&', '||', '??', '?', ':', '===', '==', '>=', '<=', '<', '>', '!=', '!=='];
    const Reader = class {
        values;
        curly;
        paren;
        constructor() {
            this.values = [], this.curly = this.paren = -1;
        }

        beforeFunctionExpression(e) {
            return beforeFunctionExpressionTokens.includes(e);
        }

        isRegexStart() {
            const e = this.values[this.values.length - 1];
            let t = e !== null;
            switch (e) {
                case 'this':
                case ']':
                    t = !1;
                    break;
                case ')':
                    const e = this.values[this.paren - 1];
                    t = e === 'if' || e === 'while' || e === 'for' || e === 'with';
                    break;
                case '}':
                    if (t = !0, this.values[this.curly - 3] === 'function') {
                        const e = this.values[this.curly - 4];
                        t = !!e && !this.beforeFunctionExpression(e);
                    } else if (this.values[this.curly - 4] === 'function') {
                        const e = this.values[this.curly - 5];
                        t = !e || !this.beforeFunctionExpression(e);
                    }
            }
            return t;
        }

        push(e) {
            e.type === 7 || e.type === 4 ? (e.value === '{' ? this.curly = this.values.length : e.value === '(' && (this.paren = this.values.length), this.values.push(e.value)) : this.values.push(null);
        }
    };
    const Tokenizer = class {
        errorHandler;
        scanner;
        trackRange;
        trackLoc;
        buffer;
        reader;
        constructor(e, t) {
            this.errorHandler = new ErrorHandler(), this.errorHandler.tolerant = !!t && (typeof t.tolerant === 'boolean' && t.tolerant), this.scanner = new Scanner(e, this.errorHandler), this.scanner.trackComment = !!t && (typeof t.comment === 'boolean' && t.comment), this.trackRange = !!t && (typeof t.range === 'boolean' && t.range), this.trackLoc = !!t && (typeof t.loc === 'boolean' && t.loc), this.buffer = [], this.reader = new Reader();
        }

        errors() {
            return this.errorHandler.errors;
        }

        getNextToken() {
            if (this.buffer.length === 0) {
                const e = this.scanner.scanComments();
                if (this.scanner.trackComment) {
                    for (let t = 0; t < e.length; ++t) {
                        const s = e[t];
                        const i = this.scanner.source.slice(s.slice[0], s.slice[1]);
                        const r = {
                            type: s.multiLine ? 'BlockComment' : 'LineComment',
                            value: i
                        };
                        this.trackRange && (r.range = s.range), this.trackLoc && (r.loc = s.loc), this.buffer.push(r);
                    }
                }
                if (!this.scanner.eof()) {
                    let e;
                    this.trackLoc && (e = {
                        start: {
                            line: this.scanner.lineNumber,
                            column: this.scanner.index - this.scanner.lineStart
                        },
                        end: {}
                    });
                    let t;
                    if (this.scanner.source[this.scanner.index] === '/' && this.reader.isRegexStart()) {
                        const e = this.scanner.saveState();
                        try {
                            t = this.scanner.scanRegExp();
                        } catch (s) {
                            this.scanner.restoreState(e), t = this.scanner.lex();
                        }
                    } else t = this.scanner.lex();
                    this.reader.push(t);
                    const s = {
                        type: TokenName[t.type],
                        value: this.scanner.source.slice(t.start, t.end)
                    };
                    if (this.trackRange && (s.range = [t.start, t.end]), this.trackLoc && (e.end = {
                        line: this.scanner.lineNumber,
                        column: this.scanner.index - this.scanner.lineStart
                    }, s.loc = e), t.type === 9) {
                        const e = t.pattern;
                        const i = t.flags;
                        s.regex = {
                            pattern: e,
                            flags: i
                        };
                    }
                    this.buffer.push(s);
                }
            }
            return this.buffer.shift();
        }
    };
    const Visitor = class {
        visit(e) {
            if (e == null) return e;
            switch (e.type) {
                case 'AssignmentExpression':
                    return this.visitAssignmentExpression(e);
                case 'AssignmentPattern':
                    return this.visitAssignmentPattern(e);
                case 'ArrayExpression':
                    return this.visitArrayExpression(e);
                case 'ArrayPattern':
                    return this.visitArrayPattern(e);
                case 'ArrowFunctionExpression':
                    return this.visitArrowFunctionExpression(e);
                case 'AwaitExpression':
                    return this.visitAwaitExpression(e);
                case 'BlockStatement':
                    return this.visitBlockStatement(e);
                case 'BinaryExpression':
                    return this.visitBinaryExpression(e);
                case 'BreakStatement':
                    return this.visitBreakStatement(e);
                case 'CallExpression':
                    return this.visitCallExpression(e);
                case 'CatchClause':
                    return this.visitCatchClause(e);
                case 'ChainExpression':
                    return this.visitChainExpression(e);
                case 'ClassBody':
                    return this.visitClassBody(e);
                case 'ClassDeclaration':
                    return this.visitClassDeclaration(e);
                case 'ClassExpression':
                    return this.visitClassExpression(e);
                case 'ConditionalExpression':
                    return this.visitConditionalExpression(e);
                case 'ContinueStatement':
                    return this.visitContinueStatement(e);
                case 'Decorator':
                    return this.visitDecorator(e);
                case 'DoWhileStatement':
                    return this.visitDoWhileStatement(e);
                case 'DebuggerStatement':
                    return this.visitDebuggerStatement(e);
                case 'EmptyStatement':
                    return this.visitEmptyStatement(e);
                case 'ExportAllDeclaration':
                    return this.visitExportAllDeclaration(e);
                case 'ExportDefaultDeclaration':
                    return this.visitExportDefaultDeclaration(e);
                case 'ExportNamedDeclaration':
                    return this.visitExportNamedDeclaration(e);
                case 'ExportSpecifier':
                    return this.visitExportSpecifier(e);
                case 'ExpressionStatement':
                    return this.visitExpressionStatement(e);
                case 'ForStatement':
                    return this.visitForStatement(e);
                case 'ForOfStatement':
                    return this.visitForOfStatement(e);
                case 'ForInStatement':
                    return this.visitForInStatement(e);
                case 'FunctionDeclaration':
                    return this.visitFunctionDeclaration(e);
                case 'FunctionExpression':
                    return this.visitFunctionExpression(e);
                case 'Identifier':
                    return this.visitIdentifier(e);
                case 'IfStatement':
                    return this.visitIfStatement(e);
                case 'ImportAttribute':
                    return this.visitImportAttribute(e);
                case 'ImportExpression':
                    return this.visitImportExpression(e);
                case 'ImportDeclaration':
                    return this.visitImportDeclaration(e);
                case 'ImportDefaultSpecifier':
                    return this.visitImportDefaultSpecifier(e);
                case 'ImportNamespaceSpecifier':
                    return this.visitImportNamespaceSpecifier(e);
                case 'ImportSpecifier':
                    return this.visitImportSpecifier(e);
                case 'Literal':
                    return this.visitLiteral(e);
                case 'LabeledStatement':
                    return this.visitLabeledStatement(e);
                case 'LogicalExpression':
                    return this.visitLogicalExpression(e);
                case 'MemberExpression':
                    return this.visitMemberExpression(e);
                case 'MetaProperty':
                    return this.visitMetaProperty(e);
                case 'MethodDefinition':
                    return this.visitMethodDefinition(e);
                case 'NewExpression':
                    return this.visitNewExpression(e);
                case 'ObjectExpression':
                    return this.visitObjectExpression(e);
                case 'ObjectPattern':
                    return this.visitObjectPattern(e);
                case 'Program':
                    return this.visitProgram(e);
                case 'Property':
                    return this.visitProperty(e);
                case 'PrivateIdentifier':
                    return this.visitPrivateIdentifier(e);
                case 'RestElement':
                    return this.visitRestElement(e);
                case 'ReturnStatement':
                    return this.visitReturnStatement(e);
                case 'SequenceExpression':
                    return this.visitSequenceExpression(e);
                case 'SpreadElement':
                    return this.visitSpreadElement(e);
                case 'StaticBlock':
                    return this.visitStaticBlock(e);
                case 'Super':
                    return this.visitSuper(e);
                case 'SwitchCase':
                    return this.visitSwitchCase(e);
                case 'SwitchStatement':
                    return this.visitSwitchStatement(e);
                case 'TaggedTemplateExpression':
                    return this.visitTaggedTemplateExpression(e);
                case 'TemplateElement':
                    return this.visitTemplateElement(e);
                case 'TemplateLiteral':
                    return this.visitTemplateLiteral(e);
                case 'ThisExpression':
                    return this.visitThisExpression(e);
                case 'ThrowStatement':
                    return this.visitThrowStatement(e);
                case 'TryStatement':
                    return this.visitTryStatement(e);
                case 'UnaryExpression':
                    return this.visitUnaryExpression(e);
                case 'UpdateExpression':
                    return this.visitUpdateExpression(e);
                case 'VariableDeclaration':
                    return this.visitVariableDeclaration(e);
                case 'VariableDeclarator':
                    return this.visitVariableDeclarator(e);
                case 'WhileStatement':
                    return this.visitWhileStatement(e);
                case 'WithStatement':
                    return this.visitWithStatement(e);
                case 'YieldExpression':
                    return this.visitYieldExpression(e);
            }
        }

        visitNodeList(e) {
            if (e == null) return e;
            let t = null;
            for (let s = 0, i = e.length; s < i; s++) {
                const i = this.visit(e[s]);
                if (t != null) t.push(i);
                else if (i != e[s]) {
                    t = [];
                    for (let i = 0; i < s; i++) t.push(e[i]);
                    t.push(i);
                }
            }
            return t != null ? t : e;
        }

        visitAssignmentExpression(e) {
            const t = this.visit(e.left);
            const s = this.visit(e.right);
            return t !== e.left || s !== e.right ? new AssignmentExpression(e.operator, t, s) : e;
        }

        visitAssignmentPattern(e) {
            const t = this.visit(e.left);
            const s = this.visit(e.right);
            return t !== e.left || s !== e.right ? new AssignmentPattern(t, s) : e;
        }

        visitArrayExpression(e) {
            const t = this.visitNodeList(e.elements);
            return t !== e.elements ? new ArrayExpression(t) : e;
        }

        visitArrayPattern(e) {
            const t = this.visitNodeList(e.elements);
            return t !== e.elements ? new ArrayPattern(t) : e;
        }

        visitArrowFunctionExpression(e) {
            const t = this.visit(e.id);
            const s = this.visitNodeList(e.params);
            const i = this.visit(e.body);
            if (t !== e.id || s !== e.params || i !== e.body) {
                const r = new ArrowFunctionExpression(s, i, e.expression, e.async);
                return r.id = t, r;
            }
            return e;
        }

        visitAwaitExpression(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new AwaitExpression(t) : e;
        }

        visitBlockStatement(e) {
            const t = this.visitNodeList(e.body);
            return t !== e.body ? new BlockStatement(t) : e;
        }

        visitBinaryExpression(e) {
            const t = this.visit(e.left);
            const s = this.visit(e.right);
            return t !== e.left || s !== e.right ? new BinaryExpression(e.operator, t, s) : e;
        }

        visitBreakStatement(e) {
            const t = this.visit(e.label);
            return t !== e.label ? new BreakStatement(t) : e;
        }

        visitCallExpression(e) {
            const t = this.visit(e.callee);
            const s = this.visitNodeList(e.arguments);
            return t !== e.callee || s !== e.arguments ? new CallExpression(t, s, e.optional) : e;
        }

        visitCatchClause(e) {
            const t = this.visit(e.param);
            const s = this.visit(e.body);
            return t !== e.param || s !== e.body ? new CatchClause(t, s) : e;
        }

        visitChainExpression(e) {
            const t = this.visit(e.expression);
            return t !== e.expression ? new ChainExpression(t) : e;
        }

        visitClassBody(e) {
            const t = this.visitNodeList(e.body);
            return t !== e.body ? new ClassBody(t) : e;
        }

        visitClassDeclaration(e) {
            const t = this.visit(e.id);
            const s = this.visit(e.superClass);
            const i = this.visit(e.body);
            const r = this.visitNodeList(e.decorators);
            return t !== e.id || s !== e.superClass || i !== e.body || r !== e.decorators ? new ClassDeclaration(t, s, i, r) : e;
        }

        visitClassExpression(e) {
            const t = this.visit(e.id);
            const s = this.visit(e.superClass);
            const i = this.visit(e.body);
            const r = this.visitNodeList(e.decorators);
            return t !== e.id || s !== e.superClass || i !== e.body || r !== e.decorators ? new ClassExpression(t, s, i, r) : e;
        }

        visitConditionalExpression(e) {
            const t = this.visit(e.test);
            const s = this.visit(e.consequent);
            const i = this.visit(e.alternate);
            return t !== e.test || s !== e.consequent || i !== e.alternate ? new ConditionalExpression(t, s, i) : e;
        }

        visitContinueStatement(e) {
            const t = this.visit(e.label);
            return t !== e.label ? new ContinueStatement(t) : e;
        }

        visitDecorator(e) {
            const t = this.visit(e.expression);
            return t !== e.expression ? new Decorator(t) : e;
        }

        visitDoWhileStatement(e) {
            const t = this.visit(e.body);
            const s = this.visit(e.test);
            return t !== e.body || s !== e.test ? new DoWhileStatement(t, s) : e;
        }

        visitDebuggerStatement(e) {
            return e;
        }

        visitEmptyStatement(e) {
            return e;
        }

        visitExportAllDeclaration(e) {
            const t = this.visit(e.source);
            const s = this.visit(e.exported);
            const i = this.visitNodeList(e.assertions);
            return t !== e.source || s !== e.exported || i !== e.assertions ? new ExportAllDeclaration(t, s, i) : e;
        }

        visitExportDefaultDeclaration(e) {
            const t = this.visit(e.declaration);
            return t !== e.declaration ? new ExportDefaultDeclaration(t) : e;
        }

        visitExportNamedDeclaration(e) {
            const t = this.visit(e.declaration);
            const s = this.visitNodeList(e.specifiers);
            const i = this.visit(e.source);
            const r = this.visitNodeList(e.assertions);
            return t !== e.declaration || s !== e.specifiers || i !== e.source || r !== e.assertions ? new ExportNamedDeclaration(t, s, i, r) : e;
        }

        visitExportSpecifier(e) {
            const t = this.visit(e.exported);
            const s = this.visit(e.local);
            return t !== e.exported || s !== e.local ? new ExportSpecifier(t, s) : e;
        }

        visitExpressionStatement(e) {
            const t = this.visit(e.expression);
            return t !== e.expression ? new ExpressionStatement(t) : e;
        }

        visitForStatement(e) {
            const t = this.visit(e.init);
            const s = this.visit(e.test);
            const i = this.visit(e.update);
            const r = this.visit(e.body);
            return t !== e.init || s !== e.test || i !== e.update || r !== e.body ? new ForStatement(t, s, i, r) : e;
        }

        visitForOfStatement(e) {
            const t = this.visit(e.left);
            const s = this.visit(e.right);
            const i = this.visit(e.body);
            return t !== e.left || s !== e.right || i !== e.body ? new ForOfStatement(t, s, i, e.await) : e;
        }

        visitForInStatement(e) {
            const t = this.visit(e.left);
            const s = this.visit(e.right);
            const i = this.visit(e.body);
            return t !== e.left || s !== e.right || i !== e.body ? new ForInStatement(t, s, i) : e;
        }

        visitFunctionDeclaration(e) {
            const t = this.visit(e.id);
            const s = this.visitNodeList(e.params);
            const i = this.visit(e.body);
            return t !== e.id || s !== e.params || i !== e.body ? new FunctionDeclaration(t, s, i, e.generator) : e;
        }

        visitFunctionExpression(e) {
            const t = this.visit(e.id);
            const s = this.visitNodeList(e.params);
            const i = this.visit(e.body);
            return t !== e.id || s !== e.params || i !== e.body ? new FunctionExpression(t, s, i, e.generator, e.async) : e;
        }

        visitIdentifier(e) {
            return e;
        }

        visitIfStatement(e) {
            const t = this.visit(e.test);
            const s = this.visit(e.consequent);
            const i = this.visit(e.alternate);
            return t !== e.test || s !== e.consequent || i !== e.alternate ? new IfStatement(t, s, i) : e;
        }

        visitImportAttribute(e) {
            const t = this.visit(e.key);
            const s = this.visit(e.value);
            return t !== e.key || s !== e.value ? new ImportAttribute(t, s) : e;
        }

        visitImportExpression(e) {
            const t = this.visit(e.source);
            const s = this.visit(e.attributes);
            return t !== e.source || s !== e.attributes ? new ImportExpression(t, s) : e;
        }

        visitImportDeclaration(e) {
            const t = this.visitNodeList(e.specifiers);
            const s = this.visit(e.source);
            const i = this.visitNodeList(e.assertions);
            return t !== e.specifiers || s !== e.source || i !== e.assertions ? new ImportDeclaration(t, s, i) : e;
        }

        visitImportDefaultSpecifier(e) {
            const t = this.visit(e.local);
            return t !== e.local ? new ImportDefaultSpecifier(t) : e;
        }

        visitImportNamespaceSpecifier(e) {
            const t = this.visit(e.local);
            return t !== e.local ? new ImportNamespaceSpecifier(t) : e;
        }

        visitImportSpecifier(e) {
            const t = this.visit(e.local);
            const s = this.visit(e.imported);
            return t !== e.local || s !== e.imported ? new ImportSpecifier(t, s) : e;
        }

        visitLiteral(e) {
            return e;
        }

        visitLabeledStatement(e) {
            const t = this.visit(e.label);
            const s = this.visit(e.body);
            return t !== e.label || s !== e.body ? new LabeledStatement(t, s) : e;
        }

        visitLogicalExpression(e) {
            const t = this.visit(e.left);
            const s = this.visit(e.right);
            return t !== e.left || s !== e.right ? new LogicalExpression(e.operator, t, s) : e;
        }

        visitMemberExpression(e) {
            const t = this.visit(e.object);
            const s = this.visit(e.property);
            return t !== e.object || s !== e.property ? new MemberExpression(e.computed, t, s, e.optional) : e;
        }

        visitMetaProperty(e) {
            const t = this.visit(e.meta);
            const s = this.visit(e.property);
            return t !== e.meta || s !== e.property ? new MetaProperty(t, s) : e;
        }

        visitMethodDefinition(e) {
            const t = this.visit(e.key);
            const s = this.visit(e.value);
            const i = this.visitNodeList(e.decorators);
            return t !== e.key || s !== e.value || i !== e.decorators ? new MethodDefinition(t, e.computed, s, e.kind, e.static, i) : e;
        }

        visitNewExpression(e) {
            const t = this.visit(e.callee);
            const s = this.visitNodeList(e.arguments);
            return t !== e.callee || s !== e.arguments ? new NewExpression(t, s) : e;
        }

        visitObjectExpression(e) {
            const t = this.visitNodeList(e.properties);
            return t !== e.properties ? new ObjectExpression(t) : e;
        }

        visitObjectPattern(e) {
            const t = this.visitNodeList(e.properties);
            return t !== e.properties ? new ObjectPattern(t) : e;
        }

        visitProgram(e) {
            const t = this.visitNodeList(e.body);
            return t !== e.body ? new Program(e.sourceType, t) : e;
        }

        visitProperty(e) {
            const t = this.visit(e.key);
            const s = this.visit(e.value);
            const i = this.visitNodeList(e.decorators);
            return t !== e.key || s !== e.value || i != i ? 'kind' in e ? new Property(e.kind, t, e.computed, s, e.method, e.shorthand) : new PropertyDefinition(t, e.computed, s, e.static, i) : e;
        }

        visitPrivateIdentifier(e) {
            return e;
        }

        visitRestElement(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new RestElement(t) : e;
        }

        visitReturnStatement(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new ReturnStatement(t) : e;
        }

        visitSequenceExpression(e) {
            const t = this.visitNodeList(e.expressions);
            return t !== e.expressions ? new SequenceExpression(t) : e;
        }

        visitSpreadElement(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new SpreadElement(t) : e;
        }

        visitStaticBlock(e) {
            const t = this.visitNodeList(e.body);
            return t !== e.body ? new StaticBlock(t) : e;
        }

        visitSuper(e) {
            return e;
        }

        visitSwitchCase(e) {
            const t = this.visit(e.test);
            const s = this.visitNodeList(e.consequent);
            return t !== e.test || s !== e.consequent ? new SwitchCase(t, s) : e;
        }

        visitSwitchStatement(e) {
            const t = this.visit(e.discriminant);
            const s = this.visitNodeList(e.cases);
            return t !== e.discriminant || s !== e.cases ? new SwitchStatement(t, s) : e;
        }

        visitTaggedTemplateExpression(e) {
            const t = this.visit(e.tag);
            const s = this.visit(e.quasi);
            return t !== e.tag || s !== e.quasi ? new TaggedTemplateExpression(t, s) : e;
        }

        visitTemplateElement(e) {
            return e;
        }

        visitTemplateLiteral(e) {
            const t = this.visitNodeList(e.quasis);
            const s = this.visitNodeList(e.expressions);
            return t !== e.quasis || s !== e.expressions ? new TemplateLiteral(t, s) : e;
        }

        visitThisExpression(e) {
            return e;
        }

        visitThrowStatement(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new ThrowStatement(t) : e;
        }

        visitTryStatement(e) {
            const t = this.visit(e.block);
            const s = this.visit(e.handler);
            const i = this.visit(e.finalizer);
            return t !== e.block || s !== e.handler || i !== e.finalizer ? new TryStatement(t, s, i) : e;
        }

        visitUnaryExpression(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new UnaryExpression(e.operator, t) : e;
        }

        visitUpdateExpression(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new UpdateExpression(e.operator, t, e.prefix) : e;
        }

        visitVariableDeclaration(e) {
            const t = this.visitNodeList(e.declarations);
            return t !== e.declarations ? new VariableDeclaration(t, e.kind) : e;
        }

        visitVariableDeclarator(e) {
            const t = this.visit(e.id);
            const s = this.visit(e.init);
            return t !== e.id || s !== e.init ? new VariableDeclarator(t, s) : e;
        }

        visitWhileStatement(e) {
            const t = this.visit(e.test);
            const s = this.visit(e.body);
            return t !== e.test || s !== e.body ? new WhileStatement(t, s) : e;
        }

        visitWithStatement(e) {
            const t = this.visit(e.object);
            const s = this.visit(e.body);
            return t !== e.object || s !== e.body ? new WithStatement(t, s) : e;
        }

        visitYieldExpression(e) {
            const t = this.visit(e.argument);
            return t !== e.argument ? new YieldExpression(t, e.delegate) : e;
        }
    };

    function parse(e, t, s) {
        let i = null;
        const r = (e, t) => {
            s && s(e, t), i && i.visit(e, t);
        };
        let n = typeof s === 'function' ? r : null;
        let a = !1;
        if (t) {
            a = typeof t.comment === 'boolean' && t.comment;
            const e = typeof t.attachComment === 'boolean' && t.attachComment;
            (a || e) && (i = new CommentHandler(), i.attach = e, t.comment = !0, n = r);
        }
        let o; let
            u = !1;
        t && typeof t.sourceType === 'string' && (u = t.sourceType === 'module'), o = t && typeof t.jsx === 'boolean' && t.jsx ? new JSXParser(e, t, n) : new Parser(e, t, n);
        const h = u ? o.parseModule() : o.parseScript();
        return a && i && (h.comments = i.comments), o.config.tokens && (h.tokens = o.tokens), o.config.tolerant && (h.errors = o.errorHandler.errors), h;
    }

    function parseModule(e, t, s) {
        const i = t || {};
        return i.sourceType = 'module', parse(e, i, s);
    }

    function parseScript(e, t, s) {
        const i = t || {};
        return i.sourceType = 'script', parse(e, i, s);
    }

    function tokenize(e, t, s) {
        const i = new Tokenizer(e, t);
        const r = [];
        try {
            for (;;) {
                let e = i.getNextToken();
                if (!e) break;
                s && (e = s(e)), r.push(e);
            }
        } catch (e) {
            i.errorHandler.tolerate(e);
        }
        return i.errorHandler.tolerant && (r.errors = i.errors()), r;
    }
    const version = '6.0.3';
    // eslint-disable-next-line camelcase
    return {
        parse,
        parseModule,
        parseScript,
        tokenize,
        Syntax,
        version
    };
})();